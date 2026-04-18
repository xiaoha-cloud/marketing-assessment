"""Reusable text normalization helpers for raw dataset preprocessing."""

from __future__ import annotations

import html
import re
from typing import Iterable

import pandas as pd

from src.config import PLACEHOLDER_VALUES


def normalize_text_value(value: object) -> str:
    """Normalize a single text-like value conservatively for downstream cleaning.

    Steps:
    - convert null-like values to empty string
    - decode HTML entities (for example: '&amp;' -> '&')
    - trim surrounding whitespace
    - collapse repeated internal whitespace
    - normalize common dash variants
    """
    if pd.isna(value) or value is None:
        return ""

    text = html.unescape(str(value))
    text = text.replace("\u2013", "-").replace("\u2014", "-")
    text = re.sub(r"\s+", " ", text.strip())

    if text.lower() in PLACEHOLDER_VALUES:
        return ""
    return text


def normalize_text_fields(df: pd.DataFrame, columns: Iterable[str]) -> pd.DataFrame:
    """Apply base normalization to selected text columns."""
    out = df.copy()
    for col in columns:
        if col in out.columns:
            out[col] = out[col].map(normalize_text_value)
    return out


def normalize_key(text: str) -> str:
    """Lowercase, collapse spaces — stable key for matching names or companies."""
    return re.sub(r"\s+", " ", text.strip().lower())
