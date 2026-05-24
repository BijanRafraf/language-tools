#!/usr/bin/env python3
"""
Add English translations to data.csv by translating the 'infinitive' column.

Usage:
    pip install deep-translator
    python3 scripts/add_english_translations.py

Output: src/data/languages/fr/data.csv is updated in-place with an 'english' column
        added as the second column (after 'infinitive').

The script is resumable: if 'english' is already populated for a row it is kept,
so you can safely re-run after an interruption.
"""

import csv
import os
import sys
import time

try:
    from deep_translator import GoogleTranslator
except ImportError:
    print("ERROR: deep-translator is not installed.")
    print("Run: pip install deep-translator")
    sys.exit(1)

INPUT_FILE = os.path.join(
    os.path.dirname(__file__), "..", "src", "data", "languages", "fr", "data.csv"
)
INPUT_FILE = os.path.normpath(INPUT_FILE)

# How many verbs to translate per API call (batching reduces requests)
BATCH_SIZE = 50

# Seconds to wait between batches (be polite to the free API)
DELAY = 0.5


def build_batch_prompt(infinitives: list[str]) -> str:
    """
    Ask for translations as a simple numbered list so the response is easy to parse.
    GoogleTranslator translates plain text, so we encode the list as newline-separated
    entries and decode the response the same way.
    """
    return "\n".join(infinitives)


def translate_batch(translator: GoogleTranslator, infinitives: list[str]) -> list[str]:
    """Translate a batch of French infinitives to English, returning 'to <verb>' forms."""
    joined = build_batch_prompt(infinitives)
    result = translator.translate(joined)
    # Split the translated block back into individual lines
    translations = [line.strip() for line in result.split("\n")]

    # If the count doesn't match, fall back to one-by-one translation
    if len(translations) != len(infinitives):
        translations = []
        for infinitive in infinitives:
            try:
                t = translator.translate(infinitive)
                translations.append(t.strip())
            except Exception as e:
                print(f"  WARNING: failed to translate '{infinitive}': {e}")
                translations.append("")
        return translations

    return translations


def main() -> None:
    if not os.path.exists(INPUT_FILE):
        print(f"ERROR: Input file not found: {INPUT_FILE}")
        sys.exit(1)

    print(f"Reading {INPUT_FILE} ...")

    with open(INPUT_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        original_fields = reader.fieldnames or []
        rows = list(reader)

    if not rows:
        print("ERROR: CSV is empty.")
        sys.exit(1)

    # Insert 'english' as the second column if not already present
    if "english" not in original_fields:
        output_fields = list(original_fields[:]) + ["english"]
    else:
        output_fields = list(original_fields)

    # Identify rows that still need translation
    needs_translation = [
        (i, row) for i, row in enumerate(rows)
        if not row.get("english", "")
    ]

    total = len(rows)
    already_done = total - len(needs_translation)

    if already_done:
        print(f"{already_done}/{total} rows already have translations — skipping those.")

    if not needs_translation:
        print("All rows already translated. Nothing to do.")
        return

    print(f"Translating {len(needs_translation)} verbs in batches of {BATCH_SIZE} ...")

    translator = GoogleTranslator(source="fr", target="en")

    # Process in batches
    batch_indices = range(0, len(needs_translation), BATCH_SIZE)
    for batch_start in batch_indices:
        batch = needs_translation[batch_start : batch_start + BATCH_SIZE]
        infinitives = [row["infinitive"] for _, row in batch]

        batch_num = batch_start // BATCH_SIZE + 1
        total_batches = (len(needs_translation) + BATCH_SIZE - 1) // BATCH_SIZE
        print(f"  Batch {batch_num}/{total_batches}: {infinitives[0]} … {infinitives[-1]}")

        try:
            translations = translate_batch(translator, infinitives)
        except Exception as e:
            print(f"  ERROR on batch {batch_num}: {e}")
            print("  Saving progress and stopping. Re-run to resume.")
            break

        for (row_index, row), translation in zip(batch, translations):
            rows[row_index]["english"] = translation

        # Write progress after every batch so an interruption doesn't lose work
        _write_csv(INPUT_FILE, output_fields, rows)

        if batch_start + BATCH_SIZE < len(needs_translation):
            time.sleep(DELAY)

    print(f"\nDone. Updated file: {INPUT_FILE}")


def _write_csv(path: str, fields: list[str], rows: list[dict]) -> None:
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    main()
