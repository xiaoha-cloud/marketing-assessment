"""Rule-based senior marketing role classification and seniority ranking."""

from __future__ import annotations

import pandas as pd

from src.roles import (
    _SENIORITY_PATTERNS,
    _combined_text,
    is_excluded_role,
    is_included_marketing_leader,
    is_target_marketing_row,
    seniority_score,
)


def _role_category(row: pd.Series) -> str:
    """Assign a stable category label for explainability and debugging."""
    if is_excluded_role(row):
        return "excluded"
    if not is_included_marketing_leader(row):
        return "not_included"
    text = _combined_text(row)
    for level, pattern in _SENIORITY_PATTERNS:
        if pattern.search(text):
            return level
    return "other_marketing"


def classify_roles(df: pd.DataFrame) -> pd.DataFrame:
    """Add ``is_target_role``, ``role_category``, and ``seniority_rank``.

    Target rows must match configured **include** patterns and must not match **exclude**
    patterns (see ``src/config.py``). ``seniority_rank`` follows ``SENIORITY_RANKING_MAP`` for
    targets; non-target rows get ``0`` so downstream sorts stay deterministic.
    """
    out = df.copy()
    out["is_target_role"] = out.apply(is_target_marketing_row, axis=1)
    out["role_category"] = out.apply(_role_category, axis=1)
    out["seniority_rank"] = out.apply(
        lambda r: seniority_score(r) if bool(r.get("is_target_role")) else 0,
        axis=1,
    )
    return out
