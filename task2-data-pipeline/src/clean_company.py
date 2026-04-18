"""Standardize company names for display and grouping."""

from __future__ import annotations

import re

import pandas as pd

from src.clean_names import word_to_proper_case
from src.config import COMPANY_BRAND_ALIASES
from src.utils import normalize_key, normalize_text_value


def proper_case_company(name: str) -> str:
    """Light proper casing for company names (conservative)."""
    if not name:
        return name
    words = []
    for w in name.split():
        if re.fullmatch(r"[A-Z]{2,8}", w):
            words.append(w)
        else:
            words.append(word_to_proper_case(w))
    fixed = [COMPANY_BRAND_ALIASES.get(w.lower(), w) for w in words]
    return " ".join(fixed)


def extract_company_from_headline(headline: str) -> str:
    """Parse company from headline when structured ``company_name`` is empty."""
    h = normalize_text_value(headline)
    if " at " in h:
        tail = h.split(" at ", 1)[1]
        if "|" in tail:
            tail = tail.split("|", 1)[0]
        tail = tail.strip().strip(",").strip()
        if tail:
            return tail
    if " - " in h:
        tail = h.split(" - ")[-1].strip()
        if "|" in tail:
            tail = tail.split("|", 1)[0]
        tail = tail.strip().strip(",").strip()
        if tail and len(tail.split()) <= 10:
            return tail
    return ""


def company_group_key(company: str) -> str:
    """Normalize company string so common location suffixes group together."""
    k = normalize_key(company)
    k = re.sub(r"\s+ireland$", "", k)
    k = re.sub(r"\s+uk$", "", k)
    k = re.sub(r"\s+emea$", "", k)
    k = re.sub(r"\s+limited$", "", k)
    k = re.sub(r"\s+ltd\.?$", "", k)
    return k.strip()


def standardize_company_names(df: pd.DataFrame) -> pd.DataFrame:
    """Add ``company_name_clean``: structured company, else parsed from headline, then cased."""
    out = df.copy()

    def _fill_row(row: pd.Series) -> str:
        company = normalize_text_value(row.get("company_name", ""))
        headline = normalize_text_value(row.get("headline", ""))
        if not company:
            company = extract_company_from_headline(headline)
        return proper_case_company(company)

    out["company_name_clean"] = out.apply(_fill_row, axis=1)
    return out
