"""Extract readable job titles from noisy LinkedIn-style headlines."""

from __future__ import annotations

import pandas as pd

from src.utils import normalize_text_value


def extract_title_from_headline(headline: str) -> str:
    """Return a conservative job-title fragment from a headline.

    Handles common patterns:
    - ``Title | Skills | ...`` — keep the segment before the first pipe.
    - ``Title at Company`` — drop the ``at Company`` tail when it looks like a company name
      (short tail, not a full skill stack).
    """
    h = normalize_text_value(headline)
    if not h:
        return ""
    if "|" in h:
        h = h.split("|", 1)[0].strip()
    if " at " in h:
        before, after = h.rsplit(" at ", 1)
        after_words = after.split()
        if len(after_words) <= 8:
            h = before.strip()
    return h.strip(" ,;-")


def extract_job_titles(df: pd.DataFrame) -> pd.DataFrame:
    """Add ``job_title_clean`` derived from ``headline``."""
    out = df.copy()
    if "headline" not in out.columns:
        out["job_title_clean"] = ""
        return out
    out["job_title_clean"] = out["headline"].map(extract_title_from_headline)
    return out
