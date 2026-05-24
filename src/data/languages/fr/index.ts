import { LanguageConfig, Verb } from '../../types';
import verbsData from './verbs.generated.json';

const fr: LanguageConfig = {
  "code": "fr",
  "label": "French",
  "pronouns": [
    "je",
    "tu",
    "il/elle",
    "nous",
    "vous",
    "ils/elles"
  ],
  "tenses": [
    {
      "key": "present",
      "label": "Présent",
      "pronouns": [
        "je",
        "tu",
        "il/elle",
        "nous",
        "vous",
        "ils/elles"
      ]
    },
    {
      "key": "imparfait",
      "label": "Imparfait",
      "pronouns": [
        "je",
        "tu",
        "il/elle",
        "nous",
        "vous",
        "ils/elles"
      ]
    },
    {
      "key": "passe-compose",
      "label": "Passé composé",
      "pronouns": [
        "je",
        "tu",
        "il/elle",
        "nous",
        "vous",
        "ils/elles"
      ]
    }
  ],
  verbs: verbsData as unknown as Verb[],
};

export default fr;
