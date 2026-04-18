"""Dataset inspection and profiling for the raw marketing contacts export."""

from __future__ import annotations

import pandas as pd


def inspect_data(df: pd.DataFrame, sample_size: int = 5) -> None:
    """Print shape, dtypes, missing-value counts, and sample raw values per column.

    Output is structured in short sections to stay readable on typical terminal widths.
    """
    n_rows, n_cols = df.shape
    print("=== Dataset inspection ===")
    print(f"Shape: {n_rows} rows × {n_cols} columns")
    print()

    print("Column dtypes:")
    for col in df.columns:
        print(f"  {col}: {df[col].dtype}")
    print()

    print("Missing values (count per column):")
    missing = df.isna().sum()
    for col in df.columns:
        print(f"  {col}: {int(missing[col])}")
    print()

    print(f"Sample values (up to {sample_size} non-null values per column):")
    for col in df.columns:
        non_null = df[col].dropna()
        k = min(sample_size, len(non_null))
        samples = non_null.head(k).tolist()
        print(f"  {col}: {samples}")
    print("=== End inspection ===")
