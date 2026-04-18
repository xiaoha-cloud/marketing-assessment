"""Ranking and one-row-per-company selection."""

from __future__ import annotations

import pandas as pd

from src.roles import seniority_rank_for_row


def final_email_value(row: pd.Series) -> str:
    """Corporate email only; blank if missing or personal-only."""
    if not row.get("email_valid"):
        return ""
    if row.get("email_is_personal"):
        return ""
    return str(row.get("email_normalized") or "")


def select_one_row_per_company(df: pd.DataFrame) -> pd.DataFrame:
    """Choose the single best marketing contact per normalized company."""
    if df.empty:
        return df
    work = df.copy()
    work["_final_email"] = work.apply(final_email_value, axis=1)
    work["_email_rank"] = work["_final_email"].map(lambda s: 2 if s else 0)
    work["_linkedin_ok"] = work["linkedin_url_clean"].astype(str).str.len() > 0
    work["_seniority"] = work.apply(seniority_rank_for_row, axis=1)

    sort_cols = [
        "company_key",
        "_seniority",
        "_email_rank",
        "_linkedin_ok",
        "scraped_at_dt",
        "contact_name_clean",
    ]
    ascending = [True, False, False, False, False, True]
    work = work.sort_values(sort_cols, ascending=ascending)
    picked = work.drop_duplicates(subset=["company_key"], keep="first")
    return picked.drop(columns=["_final_email", "_email_rank", "_linkedin_ok", "_seniority"], errors="ignore")


def build_final_export(df: pd.DataFrame) -> pd.DataFrame:
    """Map internal columns to the required assessment CSV schema."""
    rows = []
    for _, row in df.iterrows():
        email_out = final_email_value(row)
        rows.append(
            {
                "company_name": row.get("company_name_clean") or "",
                "contact_name": row.get("contact_name_clean") or "",
                "job_title": row.get("job_title_clean") or "",
                "email": email_out,
                "linkedin_url": row.get("linkedin_url_clean") or "",
            }
        )
    return pd.DataFrame(rows)
