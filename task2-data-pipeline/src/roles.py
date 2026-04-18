"""Role classification: exclude non-marketing rows, include senior marketing leaders."""

from __future__ import annotations

import re

import pandas as pd

from src.config import (
    ROLE_EXCLUDE_KEYWORDS,
    ROLE_INCLUDE_KEYWORDS,
    SENIORITY_LEVEL_PATTERNS,
    SENIORITY_RANKING_MAP,
)

_EXCLUDE_PATTERNS: tuple[re.Pattern[str], ...] = tuple(
    re.compile(pattern) for pattern in ROLE_EXCLUDE_KEYWORDS
)
_INCLUDE_PATTERNS: tuple[re.Pattern[str], ...] = tuple(
    re.compile(pattern) for pattern in ROLE_INCLUDE_KEYWORDS
)
_SENIORITY_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = tuple(
    (level, re.compile(pattern)) for level, pattern in SENIORITY_LEVEL_PATTERNS
)


def _combined_text(row: pd.Series) -> str:
    h = str(row.get("headline", "") or "").lower()
    t = str(row.get("job_title_clean", "") or "").lower()
    return f"{h} {t}"


def is_excluded_role(row: pd.Series) -> bool:
    """True if headline/title clearly indicates a non-target corporate function."""
    text = _combined_text(row)
    return any(p.search(text) for p in _EXCLUDE_PATTERNS)


def is_included_marketing_leader(row: pd.Series) -> bool:
    """True if headline/title matches senior marketing leadership signals."""
    text = _combined_text(row)
    return any(p.search(text) for p in _INCLUDE_PATTERNS)


def is_target_marketing_row(row: pd.Series) -> bool:
    """Conservative inclusion: must match include patterns and not match exclude patterns."""
    if is_excluded_role(row):
        return False
    return is_included_marketing_leader(row)


def seniority_score(row: pd.Series) -> int:
    """Higher score = more senior for ranking within a company."""
    text = _combined_text(row)
    for level, pattern in _SENIORITY_PATTERNS:
        if pattern.search(text):
            return SENIORITY_RANKING_MAP[level]
    return SENIORITY_RANKING_MAP["other_marketing"]


def seniority_rank_for_row(row: pd.Series) -> int:
    """Prefer ``seniority_rank`` from ``classify_roles`` when present."""
    if "seniority_rank" in row.index:
        v = row.get("seniority_rank")
        try:
            if pd.notna(v):
                return int(v)
        except (TypeError, ValueError):
            pass
    return seniority_score(row)
