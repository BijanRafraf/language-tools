import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VerbGroup } from '@/data/types';

export type RoundSize = 10 | 20 | 50 | 'indefinite';
export type Theme = 'light' | 'dark' | 'system';

export interface SettingsState {
  tenses: string[];
  verbGroups: VerbGroup[];
  pronouns: string[];
  roundSize: RoundSize;
  theme: Theme;
  showEnglish: boolean;
  updateSettings: (
    partial: Partial<
      Pick<SettingsState, 'tenses' | 'verbGroups' | 'pronouns' | 'roundSize' | 'showEnglish'>
    >
  ) => void;
  setTheme: (theme: Theme) => void;
}

const ALL_PRONOUNS = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
const ALL_GROUPS: VerbGroup[] = ['er', 'ir', 're', 'irregular'];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      tenses: ['present'],
      verbGroups: ALL_GROUPS,
      pronouns: ALL_PRONOUNS,
      roundSize: 10 as RoundSize,
      theme: 'system' as Theme,
      showEnglish: true,
      updateSettings: (partial) => set(partial),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'language-tools-settings' }
  )
);
