import { PathOfExile } from "poe-api-ts";
import fs from "fs";
import path from "path";

import { Language } from "../src/models/Language";

PathOfExile.Settings.userAgent = "poe-log-events, moepmoep12@gmail.com";

const jsonPath = path.join(__dirname, "../src/resources/Currency.json");

const currencyGroupPath = path.join(__dirname, "../src/models/CurrencyGroup.ts");
const currencyIdPath = path.join(__dirname, "../src/models/CurrencyId.ts");

const languageMapping: Partial<Record<Language, PathOfExile.Shared.Language>> = {
  en: undefined,
  "pt-BR": PathOfExile.Shared.Language.Portuguese,
  ru: PathOfExile.Shared.Language.Russian,
  th: PathOfExile.Shared.Language.Thai,
  de: PathOfExile.Shared.Language.German,
  fr: PathOfExile.Shared.Language.French,
  es: PathOfExile.Shared.Language.Spanish,
  "ko-KR": PathOfExile.Shared.Language.Korean,
};

async function main() {
  try {
    // due to ssl problems with korean site
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const results: Partial<Record<Language, PathOfExile.Shared.Trade.Static.Group[]>> = {};

    for (const [lang, prefix] of Object.entries(languageMapping)) {
      const result = await PathOfExile.PublicAPI.Trade.getStatic(prefix);
      results[lang as Language] = result;
    }

    const data = JSON.stringify(results);

    if (!fs.existsSync(jsonPath)) fs.appendFileSync(jsonPath, data);
    else fs.writeFileSync(jsonPath, data);

    const englishResults = results.en;
    if (!englishResults) throw new Error(`Failed to retrieve results!`);

    generateEnums(englishResults);
  } catch (error) {
    console.log(error);
  }
}

function generateEnums(groups: PathOfExile.Shared.Trade.Static.Group[]) {
  generateCurrencyGroupEnum(groups);
  generateCurrencyIdEnum(groups);
}

function generateCurrencyGroupEnum(groups: PathOfExile.Shared.Trade.Static.Group[]) {
  let currencyTypes = "export enum CurrencyGroup { \n";

  for (const group of groups) {
    currencyTypes += `"${group.id}" = "${group.label || ""}",\n`;
  }
  currencyTypes += `}\n\n`;

  if (!fs.existsSync(currencyGroupPath)) fs.appendFileSync(currencyGroupPath, currencyTypes);
  else fs.writeFileSync(currencyGroupPath, currencyTypes);
}

function generateCurrencyIdEnum(groups: PathOfExile.Shared.Trade.Static.Group[]) {
  let content = "";
  let currencyId = "export type CurrencyId = ";

  for (const group of groups) {
    let groupEnum = `export enum ${group.id} { \n`;

    for (const entry of group.entries) {
      groupEnum += `"${entry.id}" = "${entry.text}",\n`;
    }

    groupEnum += `}\n\n`;
    currencyId += `| ${group.id} `;
    content += groupEnum;
  }

  content += currencyId;

  if (!fs.existsSync(currencyIdPath)) fs.appendFileSync(currencyIdPath, content);
  else fs.writeFileSync(currencyIdPath, content);
}

void main();
