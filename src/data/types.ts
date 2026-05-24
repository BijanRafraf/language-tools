export type VerbGroup = 'er' | 'ir' | 're' | 'irregular';
export type Auxiliary = 'avoir' | 'être';

export interface ConjugationMap {
  [pronoun: string]: string; // maps pronoun -> single conjugated form (matches index.ts)
}

export interface TenseConjugations {
  [tense: string]: ConjugationMap; // e.g. 'present' -> { je: 'parle' }
}

export interface Verb {
  infinitive: string; // canonical infinitive, e.g. "parler"
  english?: string; // brief gloss, e.g. "to speak" (optional in index.ts)
  group: VerbGroup;
  auxiliary?: Auxiliary; // for compound tenses
  isPronominal?: boolean;
  conjugations?: TenseConjugations; // optional; present tense is recommended for Phase 1
  variants?: string[]; // alternative infinitives/spellings
  frequency?: number; // higher = more frequent when sourced from corpus counts
  tags?: string[]; // e.g. ['common','reflexive','irregular']
  note?: string;
  rank?: number;
}

export interface TenseConfig {
  key: string;
  label: string;
  pronouns: string[];
}

export interface LanguageConfig {
  code: string; // 'fr'
  label: string; // 'French'
  pronouns: string[]; // canonical pronoun order used by UI
  tenses: TenseConfig[];
  verbs: Verb[];
}

export default {} as unknown as LanguageConfig;
