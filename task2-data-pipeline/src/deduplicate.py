"""Deduplicate rows for the same person at the same company (deterministic tie-breaks)."""

from __future__ import annotations

from dateutil import parser as date_parser

import pandas as pd

from src.roles import seniority_rank_for_row


def parse_scraped_at_value(raw: object) -> pd.Timestamp:
    """Parse a scrape timestamp using ``dateutil`` (robust to minor format noise)."""
    if pd.isna(raw) or raw is None:
        return pd.NaT
    s = str(raw).strip()
    if not s:
        return pd.NaT
    try:
        dt = date_parser.parse(s, dayfirst=False, yearfirst=True)
        return pd.Timestamp(dt)
    except (ValueError, TypeError, OverflowError):
        return pd.NaT


def parse_scraped_at_series(series: pd.Series) -> pd.Series:
    """Vectorized ``parse_scraped_at_value`` for a column."""
    return series.map(parse_scraped_at_value)


def _corporate_email_score(row: pd.Series) -> int:
    """Prefer corporate email, then empty, then personal when deduplicating."""
    if not row.get("email_valid"):
        return 0
    if row.get("email_is_personal"):
        return 1
    return 3


def _job_title_cleanliness_score(row: pd.Series) -> int:
    """Higher = prefer shorter, non-empty derived title (heuristic for 'cleaner' title)."""
    t = str(row.get("job_title_clean") or "").strip()
    if not t:
        return 0
    # Shorter titles rank higher when other fields tie (more conservative extraction).
    return max(0, 500 - len(t))


def deduplicate_profiles(df: pd.DataFrame) -> pd.DataFrame:
    """Keep one row per (name_key, company_key).

    Resolution order (all sort keys deterministic):
    1. Latest ``scraped_at_dt`` (more recent scrape wins).
    2. Higher corporate-email score (corporate > empty > personal).
    3. LinkedIn URL present over missing.
    4. Higher ``seniority_rank`` / marketing seniority (from headline/title).
    5. Cleaner/shorter ``job_title_clean`` (tie-break).
    6. ``contact_name_clean`` ascending (stable final tie-break).
    """
    if df.empty:
        return df
    work = df.copy()
    if "scraped_at_dt" not in work.columns or work["scraped_at_dt"].isna().all():
        if "scraped_at" in work.columns:
            work["scraped_at_dt"] = parse_scraped_at_series(work["scraped_at"])
        else:
            work["scraped_at_dt"] = pd.NaT

    work["_email_score"] = work.apply(_corporate_email_score, axis=1)
    work["_linkedin_ok"] = work["linkedin_url_clean"].astype(str).str.len() > 0
    work["_seniority"] = work.apply(seniority_rank_for_row, axis=1)
    work["_title_score"] = work.apply(_job_title_cleanliness_score, axis=1)

    sort_cols = [
        "name_key",
        "company_key",
        "scraped_at_dt",
        "_email_score",
        "_linkedin_ok",
        "_seniority",
        "_title_score",
        "contact_name_clean",
    ]
    ascending = [True, True, False, False, False, False, False, True]
    work = work.sort_values(sort_cols, ascending=ascending)
    deduped = work.drop_duplicates(subset=["name_key", "company_key"], keep="first")
    return deduped.drop(
        columns=["_email_score", "_linkedin_ok", "_seniority", "_title_score"],
        errors="ignore",
    )
