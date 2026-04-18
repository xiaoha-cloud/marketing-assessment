"""Ranking and final-output selection helpers."""

from __future__ import annotations

import pandas as pd

from src.roles import seniority_rank_for_row

FINAL_OUTPUT_COLUMNS = [
    "company_name",
    "contact_name",
    "job_title",
    "email",
    "linkedin_url",
]


def _string_or_empty(value: object) -> str:
    """Return a stripped string value or an empty string."""
    if pd.isna(value) or value is None:
        return ""
    return str(value).strip()


def final_email_value(row: pd.Series) -> str:
    """Corporate email only; blank if missing or personal-only."""
    if not row.get("email_valid"):
        return ""
    if row.get("email_is_personal"):
        return ""
    return _string_or_empty(row.get("email_normalized"))


def final_linkedin_value(row: pd.Series) -> str:
    """Return a cleaned LinkedIn URL or an empty string."""
    value = _string_or_empty(row.get("linkedin_url_clean"))
    if not value.startswith("https://"):
        return ""
    return value


def select_best_contact_per_company(df: pd.DataFrame) -> pd.DataFrame:
    """Choose the single best marketing contact per normalized company.

    Ranking order is deterministic:
    1. Higher seniority rank.
    2. Corporate email present.
    3. LinkedIn URL present.
    4. More recent scrape timestamp.
    5. Alphabetical company/contact/title for stable tie-breaks.
    """
    if df.empty:
        return df
    work = df.copy()
    work["_final_email"] = work.apply(final_email_value, axis=1)
    work["_email_rank"] = work["_final_email"].map(lambda s: 2 if s else 0)
    work["_linkedin_ok"] = work.apply(final_linkedin_value, axis=1).str.len() > 0
    work["_seniority"] = work.apply(seniority_rank_for_row, axis=1)

    sort_cols = [
        "company_key",
        "_seniority",
        "_email_rank",
        "_linkedin_ok",
        "scraped_at_dt",
        "company_name_clean",
        "contact_name_clean",
        "job_title_clean",
    ]
    ascending = [True, False, False, False, False, True, True, True]
    work = work.sort_values(sort_cols, ascending=ascending)
    picked = work.drop_duplicates(subset=["company_key"], keep="first")
    return picked.drop(columns=["_final_email", "_email_rank", "_linkedin_ok", "_seniority"], errors="ignore")


def build_final_output(df: pd.DataFrame) -> pd.DataFrame:
    """Map internal columns to the required assessment CSV schema."""
    rows = []
    for _, row in df.iterrows():
        rows.append(
            {
                "company_name": _string_or_empty(row.get("company_name_clean")),
                "contact_name": _string_or_empty(row.get("contact_name_clean")),
                "job_title": _string_or_empty(row.get("job_title_clean")),
                "email": final_email_value(row),
                "linkedin_url": final_linkedin_value(row),
            }
        )
    out = pd.DataFrame(rows, columns=FINAL_OUTPUT_COLUMNS)
    if out.empty:
        return out
    return out.fillna("")


def select_one_row_per_company(df: pd.DataFrame) -> pd.DataFrame:
    """Backward-compatible alias for company-level selection."""
    return select_best_contact_per_company(df)


def build_final_export(df: pd.DataFrame) -> pd.DataFrame:
    """Backward-compatible alias for final CSV mapping."""
    return build_final_output(df)
