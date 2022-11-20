/**
 * This script is used to generate TypeScript files containing enums of Currencies
 */

import { PathOfExile } from "poe-api-ts";
import { Project } from "ts-morph";
import fs from "fs";
import path from "path";
import Debug from "debug";
import * as prettier from "prettier";

import { Language } from "../src/models/Language";

PathOfExile.Settings.userAgent = "poe-log-events, moepmoep12@gmail.com";

const currencyJsonPath = path.join(__dirname, "../src/resources/Currency.json");

const currencyGroupPath = path.join(__dirname, "../src/models/TradeCurrencyGroup.ts");
const currencyIdsPath = path.join(__dirname, "../src/models/TradeCurrencyIds.ts");

Debug.enable("poe-log-events:*");
const debug = Debug(`poe-log-events:`).extend(__filename);

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
    const project = new Project({
      tsConfigFilePath: path.join(__dirname, "../tsconfig.json"),
    });

    debug(`Fetching resources from PoE API`);

    for (const [lang, prefix] of Object.entries(languageMapping)) {
      const result = await PathOfExile.PublicAPI.Trade.getStatic(prefix);
      results[lang as Language] = result;
    }

    const data = JSON.stringify(results);

    if (!fs.existsSync(currencyJsonPath)) fs.appendFileSync(currencyJsonPath, data);
    else fs.writeFileSync(currencyJsonPath, data);

    const englishResults = results.en;
    if (!englishResults) throw new Error(`Failed to fetch resources from PoE API!`);

    debug(`Generating TypesScript files`);

    generateTradeCurrencyGroups(project, englishResults);
    generateTradeCurrencyIds(project, englishResults);
    project.saveSync();

    await Promise.all([
      formatFile(currencyGroupPath),
      formatFile(currencyIdsPath),
      formatFile(currencyJsonPath),
    ]);
  } catch (error) {
    debug(`Error: %O`, error);
  }
}

function generateTradeCurrencyIds(
  project: Readonly<Project>,
  groups: Readonly<PathOfExile.Shared.Trade.Static.Group[]>
) {
  const sourceFile = fs.existsSync(currencyIdsPath)
    ? project.getSourceFile(currencyIdsPath)
    : project.createSourceFile(currencyIdsPath);
  if (!sourceFile) throw new Error(`Failed to open source file ${currencyIdsPath}`);

  sourceFile.removeText();

  let currencyUnionType = "";

  for (const group of groups) {
    const currEnum = sourceFile.addEnum({
      name: group.id,
      isExported: true,
    });

    currEnum.addJsDoc({
      description: `All currencies belonging to the group \`${group.id}\` (${
        group.label || group.id
      })`,
    });

    currencyUnionType += `| ${group.id} `;

    for (const entry of group.entries) {
      currEnum.addMember({
        name: entry.id,
        value: entry.id,
      });
    }
  }

  const tradeCurrencyId = sourceFile.addTypeAlias({
    name: "TradeCurrencyId",
    type: currencyUnionType,
    isExported: true,
  });
  tradeCurrencyId.addJsDoc({
    description: "All possible currency IDs as defined by the PoE Trade API",
  });

  sourceFile.saveSync();
  debug(`Generated file %s`, currencyIdsPath);
}

function generateTradeCurrencyGroups(
  project: Readonly<Project>,
  groups: Readonly<PathOfExile.Shared.Trade.Static.Group[]>
) {
  const sourceFile = fs.existsSync(currencyGroupPath)
    ? project.getSourceFile(currencyGroupPath)
    : project.createSourceFile(currencyGroupPath);
  if (!sourceFile) throw new Error(`Failed to open source file ${currencyGroupPath}`);

  sourceFile.removeText();

  const groupEnum = sourceFile.addEnum({
    name: "TradeCurrencyGroup",
    isExported: true,
  });

  groupEnum.addJsDoc({
    description:
      "The currency groups as defined by the PoE Trade API. \nEvery currency item belongs to one group.",
  });

  for (const group of groups) {
    groupEnum.addMember({
      name: group.id,
      value: group.id,
    });
  }

  sourceFile.saveSync();
  debug(`Generated file %s`, currencyGroupPath);
}

async function formatFile(filePath: string) {
  debug(`Formatting file %s`, filePath);

  const fileContent = fs.readFileSync(filePath);
  const prettierConfig = await prettier.resolveConfig(filePath);
  fs.writeFileSync(
    filePath,
    prettier.format(fileContent.toString(), { ...prettierConfig, filepath: filePath })
  );
}

void main();
