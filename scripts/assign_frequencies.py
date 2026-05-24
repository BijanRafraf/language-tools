#!/usr/bin/env python3
"""Assign frequencies from frequencies.txt to verbs in verb-rankings.csv.
Outputs verb-rankings-with-freq.csv with columns: infinitive,frequency,matched_token
"""
import csv
import unicodedata
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
VERBFILE = BASE / 'verb-rankings.csv'
FREQFILE = BASE / 'frequencies.txt'
OUTFILE = BASE / 'verb-rankings-with-freq.csv'


def normalize(s: str) -> str:
    s = s.strip().lower()
    # normalize accents to comparable form
    s = unicodedata.normalize('NFD', s)
    s = ''.join(ch for ch in s if not unicodedata.category(ch).startswith('M'))
    # remove surrounding punctuation commonly in frequencies file
    if s.startswith("'") or s.startswith("\""):
        s = s[1:]
    if s.endswith("'") or s.endswith("\""):
        s = s[:-1]
    return s


def load_frequencies(path: Path):
    freqs = {}
    if not path.exists():
        raise FileNotFoundError(f"Frequency file not found: {path}")
    with path.open('r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            # expect lines like: token <space> count
            parts = line.split()
            if len(parts) < 2:
                continue
            token = ' '.join(parts[:-1])
            try:
                count = int(parts[-1])
            except ValueError:
                # skip weird lines
                continue
            freqs[normalize(token)] = count
            freqs[token.lower()] = count
    return freqs


def main():
    freqs = load_frequencies(FREQFILE)

    if not VERBFILE.exists():
        raise FileNotFoundError(f"Verb file not found: {VERBFILE}")

    verbs = []
    with VERBFILE.open('r', encoding='utf-8') as vf:
        for i, line in enumerate(vf):
            if i == 0 and line.strip().lower().startswith('infinitive'):
                continue
            token = line.strip()
            if not token:
                continue
            verbs.append(token)

    rows = []
    for verb in verbs:
        n = normalize(verb)
        freq = freqs.get(n)
        matched = None
        if freq is None:
            # try some fallback attempts
            alt = verb.lower()
            if alt in freqs:
                freq = freqs[alt]
                matched = alt
            else:
                # try without apostrophes or hyphens
                cleaned = alt.replace("'", '').replace('-', ' ')
                if cleaned in freqs:
                    freq = freqs[cleaned]
                    matched = cleaned
        else:
            matched = verb
        if freq is None:
            freq = 0
        rows.append((verb, str(freq), matched or ''))

    with OUTFILE.open('w', encoding='utf-8', newline='') as out:
        writer = csv.writer(out)
        writer.writerow(['infinitive', 'frequency', 'matched_token'])
        writer.writerows(rows)

    print(f'Wrote {len(rows)} rows to {OUTFILE}')


if __name__ == '__main__':
    main()
