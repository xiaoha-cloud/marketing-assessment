"""Central configuration for rules, keywords, and domain lists."""

from __future__ import annotations

# Generic empty-like values treated as placeholders during normalization.
PLACEHOLDER_VALUES: frozenset[str] = frozenset(
    {
        "",
        "-",
        "n/a",
        "na",
        "none",
        "null",
        "tbd",
    }
)

# Domains treated as personal email providers (final CSV email must be empty if only these exist).
PERSONAL_EMAIL_DOMAINS: frozenset[str] = frozenset(
    {
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "icloud.com",
        "live.com",
        "msn.com",
        "aol.com",
        "protonmail.com",
    }
)

# Values treated as missing names.
INVALID_NAME_TOKENS: frozenset[str] = PLACEHOLDER_VALUES

# Substrings in raw_name or headline that indicate junk / ad rows (case-insensitive).
SPONSORED_NAME_OR_HEADLINE_MARKERS: tuple[str, ...] = (
    "linkedin ads",
    "sponsored content",
    "reach 900m",
)

# Honorifics removed from the start of names.
NAME_PREFIXES_TO_STRIP: tuple[str, ...] = ("dr.", "dr ", "prof.", "prof ")

# Known brand casing for display (lowercase token -> canonical).
COMPANY_BRAND_ALIASES: dict[str, str] = {
    "linkedin": "LinkedIn",
    "hubspot": "HubSpot",
    "tiktok": "TikTok",
}

# Role-inclusion signals used to keep only senior marketing candidates.
# These are regex fragments, matched against lowercase headline + cleaned job title.
ROLE_INCLUDE_KEYWORDS: tuple[str, ...] = (
    r"\bchief marketing officer\b|\bcmo\b",
    r"\bvp marketing\b|\bvp of marketing\b|vice president.{0,40}marketing",
    r"\bhead of marketing\b",
    r"\bhead of b2b marketing\b",
    r"\bhead of content marketing\b",
    r"\bhead of digital marketing\b",
    r"\bhead of marketing automation\b",
    r"\bhead of growth.{0,20}marketing\b",
    r"\bmarketing director\b|\bdirector of marketing\b|\bdirector,\s*marketing\b",
    r"\bdirector of demand generation\b|\bdirector of marketing operations\b",
    r"\bmarketing & communications director\b|\bmarketing \& communications director\b",
    r"\bsenior marketing manager\b|\bsenior marketing communications\b",
    r"\bgrowth marketing lead\b",
    r"\bhead of brand\b",
)

# Role-exclusion signals used to remove non-target functions.
ROLE_EXCLUDE_KEYWORDS: tuple[str, ...] = (
    r"\bsoftware engineer\b|\bengineer at\b",
    r"\bchief financial officer\b|\bcfo\b",
    r"\bchief technology officer\b|\bcto\b",
    r"\bchief executive officer\b|\bceo\b",
    r"\btalent acquisition\b|\bhr business partner\b|\brecruiter\b",
    r"\bsales director\b",
    r"\bmarketing coordinator\b",
    r"\bdigital marketing manager\b",
    r"\bperformance marketing manager\b",
    r"\bbrand marketing manager\b",
    r"\bmarketing technology manager\b",
    r"\bmarketing programme manager\b",
    r"\bmarketing & events manager\b",
)

# Explicit business ranking (higher = more senior) for company-level selection.
SENIORITY_RANKING_MAP: dict[str, int] = {
    "chief_marketing_officer": 100,
    "vp_marketing": 90,
    "head_of_marketing": 80,
    "marketing_director": 70,
    "senior_marketing_manager": 60,
    "growth_marketing_lead": 55,
    "other_marketing": 40,
}

# Mapping from ranking level to role-match pattern.
SENIORITY_LEVEL_PATTERNS: tuple[tuple[str, str], ...] = (
    ("chief_marketing_officer", r"\bchief marketing officer\b|\bcmo\b"),
    ("vp_marketing", r"\bvp marketing\b|\bvp of marketing\b|vice president.{0,40}marketing"),
    (
        "head_of_marketing",
        r"\bhead of marketing\b|\bhead of brand\b|\bhead of growth.{0,20}marketing\b|\bhead of b2b marketing\b|"
        r"\bhead of content marketing\b|\bhead of digital marketing\b|\bhead of marketing automation\b",
    ),
    (
        "marketing_director",
        r"\bmarketing director\b|\bdirector of marketing\b|\bdirector of demand\b|\bdirector,\s*marketing\b|"
        r"\bdirector of demand generation\b|\bdirector of marketing operations\b|"
        r"\bmarketing & communications director\b|\bmarketing \& communications director\b",
    ),
    ("senior_marketing_manager", r"\bsenior marketing manager\b|\bsenior marketing communications\b"),
    ("growth_marketing_lead", r"\bgrowth marketing lead\b"),
)
