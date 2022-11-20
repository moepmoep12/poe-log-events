import * as currencyJson from "../resources/Currency.json";
import * as regexJson from "../resources/Regex.json";

import { TradeCurrencyGroup } from "./TradeCurrencyGroup";
import { TradeCurrencyId } from "./TradeCurrencyIds";
import { Language } from "./Language";

/**
 * A currency item as used in the PoE Trade API
 */
export interface TradeCurrencyItem {
  /**
   * The {@link TradeCurrencyGroup} this currency item belongs to
   */
  group: TradeCurrencyGroup;

  /**
   * The {@link TradeCurrencyId} of this currency item
   */
  id: TradeCurrencyId;

  /**
   * Relative URL to the image of the currency item
   */
  imageURL?: string;
}

/**
 * A {@link TradeCurrencyItem} with it's localized name
 */
export interface LocalizedTradeCurrencyItem extends TradeCurrencyItem {
  /**
   * The name of the currency item in the given language
   */
  localizedName: string;

  /**
   * The language used for localization
   */
  language: Language;
}

/**
 * A currency item used in a trade bulk whisper
 */
export interface TradeBulkCurrencyItem extends LocalizedTradeCurrencyItem {
  /**
   * The name of the currency item as used in the whisper
   *
   * @remarks This may differ from the `localizedName` due to abbreviations used in the whisper
   */
  whisperLabel: string;
}

/**
 * Searches for the currency item by name
 *
 * @param name The localized name of the currency item. Can be abbreviated
 *
 * @remarks If the item is not found and the language is not English, the search is repeated in English.
 * This is due to the fact that in some languages the items are written in English
 */
export function getTradeCurrencyItemByName(
  name: string,
  language: Language
): LocalizedTradeCurrencyItem | undefined {
  if (!name) return;

  // Handle map names in whispers.
  // These are abbreviated in whispers but expanded in the static resources.
  // Hence, we need to undo the abbrevation in order to find the correct CurrencyId
  const search = new RegExp(
    (regexJson.map as Record<Language, { search: string; replace: string }>)[language].search
  );
  const replace = (regexJson.map as Record<Language, { search: string; replace: string }>)[language]
    .replace;
  const adjustedName = name.replace(search, replace);

  const currencies = currencyJson[language as keyof typeof currencyJson];

  for (const group of currencies) {
    for (const currency of group.entries) {
      if (
        currency.id == adjustedName ||
        currency.text == adjustedName ||
        currency.text == name ||
        currency.id == name
      ) {
        const result: LocalizedTradeCurrencyItem = {
          group: group.id as TradeCurrencyGroup,
          id: currency.id as TradeCurrencyId,
          localizedName: currency.text,
          language: language,
        };
        if ("image" in currency) result.imageURL = currency.image;
        return result;
      }
    }
  }

  // sometimes the items are written in english although a different language is active
  if (language != Language.English) return getTradeCurrencyItemByName(name, Language.English);
}

/**
 * Searches for the trade currency item by its Trade API ID.
 *
 * @param id The ID of the currency item as defined by the PoE trade API
 * @param language The language
 */
export function getTradeCurrencyItemByTradeId(
  id: string,
  language: Language
): LocalizedTradeCurrencyItem | undefined {
  const currencies = currencyJson[language as keyof typeof currencyJson];

  for (const group of currencies) {
    for (const currency of group.entries) {
      if (currency.id == id) {
        const result: LocalizedTradeCurrencyItem = {
          group: group.id as TradeCurrencyGroup,
          id: currency.id as TradeCurrencyId,
          localizedName: currency.text,
          language: language,
        };
        if ("image" in currency) result.imageURL = currency.image;
        return result;
      }
    }
  }
}
