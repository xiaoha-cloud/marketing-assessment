"""Task 2 marketing contacts pipeline — end-to-end data processing entrypoint."""

from pathlib import Path

import pandas as pd

from src.classify_roles import classify_roles
from src.clean_names import clean_names
from src.cleaning import clean_raw_dataframe
from src.deduplicate import deduplicate_profiles
from src.filter_rows import remove_irrelevant_rows
from src.inspect import inspect_data
from src.selection import (
    build_final_export,
    select_one_row_per_company,
)
from src.utils import normalize_text_fields

BASE_DIR = Path(__file__).resolve().parent
INPUT_CSV = BASE_DIR / "linkedin_raw_data.csv"
OUTPUT_CSV = BASE_DIR / "marketing_contacts_clean.csv"

OUTPUT_COLUMNS = [
    "company_name",
    "contact_name",
    "job_title",
    "email",
    "linkedin_url",
]

BASE_TEXT_COLUMNS = (
    "raw_name",
    "headline",
    "company_name",
    "location",
    "profile_url",
    "email",
)


def load_raw_data(path: Path) -> pd.DataFrame:
    """Load the raw LinkedIn export CSV from a path relative to this project."""
    if not path.is_file():
        raise FileNotFoundError(f"Missing input file: {path.name}")
    return pd.read_csv(path)


def run_pipeline(df: pd.DataFrame) -> pd.DataFrame:
    """Apply cleaning, filtering, deduplication, and company-level selection."""
    normalized = normalize_text_fields(df, BASE_TEXT_COLUMNS)
    with_contact_names = clean_names(normalized)
    # Job title extraction and company standardization run inside clean_raw_dataframe
    # after per-column whitespace normalization (see src/clean_titles.py, src/clean_company.py).
    cleaned = clean_raw_dataframe(with_contact_names)
    classified = classify_roles(cleaned)
    filtered = remove_irrelevant_rows(classified)
    deduped = deduplicate_profiles(filtered)
    per_company = select_one_row_per_company(deduped)
    return build_final_export(per_company)


def write_output(df: pd.DataFrame, path: Path) -> None:
    """Write the final CSV with exactly the required columns."""
    out = df.reindex(columns=OUTPUT_COLUMNS)
    out.to_csv(path, index=False)
    print(f"Wrote {path.name} ({len(out)} rows).")


def main() -> None:
    """Load data, inspect, run pipeline, and write the marketing contacts file."""
    raw = load_raw_data(INPUT_CSV)
    inspect_data(raw)
    final_df = run_pipeline(raw)
    write_output(final_df, OUTPUT_CSV)


if __name__ == "__main__":
    main()
