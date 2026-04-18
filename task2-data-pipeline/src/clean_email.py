"""Email validation, domain classification, and LinkedIn profile URL normalization."""

from __future__ import annotations

import re
from functools import lru_cache
from pathlib import Path
from urllib.parse import urlparse

import pandas as pd
import tldextract
from email_validator import EmailNotValidError, validate_email

from src.config import PERSONAL_EMAIL_DOMAINS
from src.utils import normalize_text_value

_PIPELINE_ROOT = Path(__file__).resolve().parent.parent
_TLD_CACHE_DIR = _PIPELINE_ROOT / ".cache" / "tldextract"

# Values that look like phone numbers in the email column (not valid emails).
PHONE_LIKE_VALUE = re.compile(
    r"^[\s\+]*(?:\+?\d[\d\s\-]{7,}\d|\+353[\d\s\-]+)$",
    re.IGNORECASE,
)


@lru_cache(maxsize=1)
def _get_tld_extractor() -> tldextract.TLDExtract:
    """Bundled public suffix list and project-local cache (no network fetch on startup)."""
    _TLD_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    return tldextract.TLDExtract(
        cache_dir=str(_TLD_CACHE_DIR),
        suffix_list_urls=(),
    )


def _parse_email_cell(raw: object) -> tuple[str, bool, bool]:
    """Return (normalized_email_or_empty, is_syntax_valid, is_personal_domain)."""
    if pd.isna(raw) or raw is None:
        return "", False, False
    s = normalize_text_value(raw)
    if not s:
        return "", False, False
    if PHONE_LIKE_VALUE.match(s):
        return "", False, False
    try:
        info = validate_email(s, check_deliverability=False)
        normalized = info.normalized
    except EmailNotValidError:
        return "", False, False
    host = normalized.split("@", 1)[1]
    ext = _get_tld_extractor()(host)
    if ext.suffix:
        registrable_domain = f"{ext.domain}.{ext.suffix}".lower()
    else:
        registrable_domain = host.lower()
    is_personal = registrable_domain in PERSONAL_EMAIL_DOMAINS
    return normalized, True, is_personal


def clean_emails(df: pd.DataFrame) -> pd.DataFrame:
    """Add ``email_normalized``, ``email_valid``, ``email_is_personal`` from ``email``.

    Uses ``email-validator`` for syntax; ``tldextract`` for registrable domain vs
    ``PERSONAL_EMAIL_DOMAINS``. Phone-like strings are treated as invalid.
    """
    out = df.copy()
    if "email" not in out.columns:
        out["email_normalized"] = ""
        out["email_valid"] = False
        out["email_is_personal"] = False
        return out

    parts = out["email"].map(_parse_email_cell)
    out["email_normalized"] = parts.map(lambda t: t[0])
    out["email_valid"] = parts.map(lambda t: t[1])
    out["email_is_personal"] = parts.map(lambda t: t[2])
    return out


def clean_linkedin_url(raw: object) -> str:
    """Return a full https LinkedIn profile URL or an empty string."""
    if pd.isna(raw) or raw is None:
        return ""
    s = str(raw).strip()
    if not s:
        return ""
    if s.startswith("linkedin.com"):
        s = "https://" + s
    if not s.startswith("http"):
        return ""
    try:
        parsed = urlparse(s)
    except ValueError:
        return ""
    host = (parsed.netloc or "").lower()
    if "linkedin.com" not in host:
        return ""
    path = parsed.path or ""
    if "/in/" not in path and not path.startswith("/in"):
        return ""
    if not path.startswith("/"):
        path = "/" + path
    return f"https://{host}{path}"


def normalize_linkedin_urls(df: pd.DataFrame) -> pd.DataFrame:
    """Add ``linkedin_url_clean`` from ``profile_url``."""
    out = df.copy()
    if "profile_url" not in out.columns:
        out["linkedin_url_clean"] = ""
        return out
    out["linkedin_url_clean"] = out["profile_url"].map(clean_linkedin_url)
    return out
