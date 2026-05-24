#!/usr/bin/env python3
"""Merge frequency column from verb-rankings-with-freq.csv into the language data CSV.
Writes output to src/data/languages/fr/data.with-freq.csv (safe, does not overwrite original).

Usage:
  python3 scripts/merge_freq_into_data.py
"""
import csv
import unicodedata
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
RANKS = BASE / 'verb-rankings-with-freq.csv'
DATA = BASE / 'src' / 'data' / 'languages' / 'fr' / 'data.csv'
OUT = DATA.with_name('data.with-freq.csv')


def normalize(s: str) -> str:
    if s is None:
        return ''
    s = s.strip().lower()
    s = unicodedata.normalize('NFD', s)
    s = ''.join(ch for ch in s if not unicodedata.category(ch).startswith('M'))
    return s


def load_ranks(path: Path):
    d = {}
    if not path.exists():
        raise FileNotFoundError(f"Ranks file not found: {path}")
    with path.open('r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            infinitive = row.get('infinitive') or row.get('Infinitive')
            freq = row.get('frequency')
            if infinitive is None:
                continue
            d[normalize(infinitive)] = freq or ''
    return d


def main():
    ranks = load_ranks(RANKS)
    if not DATA.exists():
        raise FileNotFoundError(f"Data file not found: {DATA}")

    with DATA.open('r', encoding='utf-8', newline='') as src, OUT.open('w', encoding='utf-8', newline='') as dst:
        reader = csv.reader(src)
        writer = csv.writer(dst)
        header = next(reader)
        # append frequency column at end
        header.append('frequency')
        writer.writerow(header)
        for row in reader:
            if not row:
                continue
            infinitive = row[0]
            freq = ranks.get(normalize(infinitive), '')
            row.append(freq)
            writer.writerow(row)

    print(f'Wrote merged file to {OUT}')


if __name__ == '__main__':
    main()
