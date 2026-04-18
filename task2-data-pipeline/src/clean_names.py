"""Contact name cleaning: readable casing, honorific removal, invalid/junk filtering."""

from __future__ import annotations

import pandas as pd

from src.config import (
    INVALID_NAME_TOKENS,
    NAME_PREFIXES_TO_STRIP,
    SPONSORED_NAME_OR_HEADLINE_MARKERS,
)
from src.utils import normalize_text_value


def strip_name_prefixes(name: str) -> str:
    """Remove common honorific prefixes from the start of a name."""
    lower = name.lower().strip()
    for prefix in NAME_PREFIXES_TO_STRIP:
        if lower.startswith(prefix):
            return name[len(prefix) :].strip()
    return name


def word_to_proper_case(word: str) -> str:
    """Capitalize a single token without applying .title() to the full name string."""
    if not word:
        return word
    if "'" in word:
        return "'".join(part.capitalize() for part in word.split("'") if part)
    if word.isupper() and len(word) > 2:
        return word.capitalize()
    return word[0].upper() + word[1:].lower() if len(word) > 1 else word.upper()


def proper_case_person_name(name: str) -> str:
    """Convert a person name to readable title case word by word."""
    if not name:
        return name
    return " ".join(word_to_proper_case(w) for w in name.split())


def clean_single_contact_name(raw: object) -> str:
    """Return a display-ready contact name, or empty string if invalid or non-person."""
    name = normalize_text_value(raw)
    if not name:
        return ""
    lower = name.lower()
    if lower in INVALID_NAME_TOKENS:
        return ""
    for marker in SPONSORED_NAME_OR_HEADLINE_MARKERS:
        if marker in lower:
            return ""
    # Single-character "names" and bare punctuation are not usable contact names.
    if len(name.replace(" ", "")) < 2:
        return ""
    name = strip_name_prefixes(name)
    return proper_case_person_name(name)


def clean_names(df: pd.DataFrame) -> pd.DataFrame:
    """Add ``contact_name_clean`` from ``raw_name`` using conservative person-name rules."""
    out = df.copy()
    if "raw_name" not in out.columns:
        out["contact_name_clean"] = ""
        return out
    out["contact_name_clean"] = out["raw_name"].map(clean_single_contact_name)
    return out
