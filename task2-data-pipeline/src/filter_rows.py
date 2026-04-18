"""Remove rows that are not usable for senior marketing selection."""

from __future__ import annotations

import pandas as pd

from src.cleaning import row_is_sponsored_or_invalid_name
from src.roles import is_target_marketing_row


def remove_irrelevant_rows(df: pd.DataFrame) -> pd.DataFrame:
    """Drop sponsored/placeholder rows, non-marketing roles, and unusable company keys.

    If ``classify_roles()`` has run, ``is_target_role`` is used; otherwise the same rule is
    evaluated via ``is_target_marketing_row``.

    This runs **before** per-person deduplication and **before** one-row-per-company selection.
    """
    if df.empty:
        return df
    work = df.copy()
    work = work[~work.apply(row_is_sponsored_or_invalid_name, axis=1)]
    work = work[work["contact_name_clean"].astype(str).str.len() > 0]
    if "is_target_role" in work.columns:
        work = work[work["is_target_role"]]
    else:
        work = work[work.apply(is_target_marketing_row, axis=1)]
    work = work[work["company_name_clean"].astype(str).str.len() > 0]
    work = work[work["company_key"].astype(str).str.len() > 0]
    return work
