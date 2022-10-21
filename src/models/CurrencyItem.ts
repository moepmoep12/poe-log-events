import * as currencyJson from "../resources/Currency.json";
import * as regex from "../resources/Regex.json";

import { CurrencyGroup } from "./CurrencyGroup";
import { CurrencyId } from "./CurrencyId";
import { Language } from "./Language";

export interface CurrencyItem {
  currencyGroup?: CurrencyGroup;
  currencyId?: CurrencyId;
  // the label according to the static resources.
  // note, that it may differ from the name in the whisper due to abbrevations
  localizedLabel?: string;

  // the name of the item as used in the whisper
  whisperLabel: string;
}

/**
 * Searches for the currency item by name
 *
 * @param name The localized name of the currency item
 */
export function getCurrencyItem(name: string, language: Language): CurrencyItem | undefined {
  if (!name) return;

  // Handle map names in whispers.
  // These are abbreviated in whispers but expanded in the static resources.
  // Hence, we need to reverse the abbrevation in order to find the correct CurrencyId
  const search = new RegExp(
    (regex.map as Record<Language, { search: string; replace: string }>)[language].search
  );
  const replace = (regex.map as Record<Language, { search: string; replace: string }>)[language]
    .replace;
  const adjustedName = name.replace(search, replace);

  const data = currencyJson[language as keyof typeof currencyJson];

  for (const group of data) {
    for (const entry of group.entries) {
      if (entry.id == adjustedName || entry.text == adjustedName) {
        return {
          currencyGroup: group.id as CurrencyGroup,
          currencyId: entry.id as CurrencyId,
          localizedLabel: entry.text,
          whisperLabel: name,
        };
      }
    }
  }

  // sometimes the items are written in english although a different language is active
  if (language != Language.English) return getCurrencyItem(name, Language.English);
}
