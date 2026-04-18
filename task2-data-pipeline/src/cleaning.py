"""Text normalization, field cleaning, and derived columns for raw profile rows."""

from __future__ import annotations

import html
import re

import pandas as pd

from src.clean_company import company_group_key, standardize_company_names
from src.clean_email import clean_emails, normalize_linkedin_urls
from src.deduplicate import parse_scraped_at_series
from src.clean_names import clean_names
from src.clean_titles import extract_job_titles
from src.config import (
    INVALID_NAME_TOKENS,
    SPONSORED_NAME_OR_HEADLINE_MARKERS,
)
from src.utils import normalize_key


def normalize_whitespace(text: object) -> str:
    """Strip, collapse internal spaces, and HTML-unescape string-like values."""
    if pd.isna(text) or text is None:
        return ""
    s = html.unescape(str(text).strip())
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def clean_raw_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Apply baseline normalization and derive cleaned columns used downstream."""
    out = df.copy()
    text_cols = [
        "raw_name",
        "headline",
        "company_name",
        "location",
        "profile_url",
        "email",
    ]
    for col in text_cols:
        if col in out.columns:
            out[col] = out[col].map(normalize_whitespace)

    if "contact_name_clean" not in out.columns:
        out = clean_names(out)
    if "job_title_clean" not in out.columns:
        out = extract_job_titles(out)
    if "company_name_clean" not in out.columns:
        out = standardize_company_names(out)

    if "email_normalized" not in out.columns:
        out = clean_emails(out)
    if "linkedin_url_clean" not in out.columns:
        out = normalize_linkedin_urls(out)

    out["scraped_at_dt"] = parse_scraped_at_series(out["scraped_at"])

    out["name_key"] = out["contact_name_clean"].map(normalize_key)
    out["company_key"] = out["company_name_clean"].map(company_group_key)

    return out


def row_is_sponsored_or_invalid_name(row: pd.Series) -> bool:
    """True if the row should be dropped before role classification."""
    name = normalize_whitespace(row.get("raw_name", ""))
    headline = normalize_whitespace(row.get("headline", ""))
    blob = f"{name} {headline}".lower()
    for marker in SPONSORED_NAME_OR_HEADLINE_MARKERS:
        if marker in blob:
            return True
    if not name or name.lower() in INVALID_NAME_TOKENS or name.strip() in {"-", "—"}:
        return True
    return False
