import Debug from "debug";
import path from "path";
import fs from "fs";
import * as prettier from "prettier";
import { PathOfExile } from "poe-api-ts";
import { Cli } from "kysely-codegen";
import { Language, PoEDB, Schema } from "exile-db";

PathOfExile.Settings.userAgent = "poe-log-events, moepmoep12@gmail.com";

import * as DbConfigJson from "./exiledb.config.json";

class ExileDBCreator {
  private readonly _debug: Debug.Debugger;
  private readonly _dbPath: string;
  private readonly _cachePath: string;
  private readonly _interfacePath: string;
  private _db: PoEDB;

  constructor() {
    Debug.enable(`poe-log-events:*,exile-db:*,poe-api-ts:*`);
    this._debug = Debug(`poe-log-events:`).extend(this.constructor.name);
    const configDir = __dirname;
    this._dbPath = path.resolve(configDir, DbConfigJson.database);
    this._cachePath = path.resolve(configDir, DbConfigJson.cachedir);
    this._interfacePath = path.resolve(__dirname, "../src/exiledb/schema.ts");
  }

  public async buildDatabase() {
    if (fs.existsSync(this._dbPath)) {
      this._debug(`Removing existing database at %s`, this._dbPath);
      fs.rmSync(this._dbPath);
    }

    this._debug(`Copying initial database to %s`, this._dbPath);
    fs.copyFileSync(new PoEDB().DbPath, this._dbPath);

    this._db = new PoEDB(this._dbPath, this._cachePath);

    await this._loadTables();

    await this._dropUnusedTables();

    await this._generateTsInterface();

    await this._formatFile(this._interfacePath);
  }

  private async _loadTables() {
    this._debug(`Loading tables`);

    for (const table of DbConfigJson.tables) {
      await this._db.tryLoadTable(table as keyof Schema.DB, DbConfigJson.languages as Language[]);
    }
  }

  private async _dropUnusedTables() {
    this._debug(`Dropping unused tables`);

    const tables = await this._db.introspection.getTables();

    for (const table of tables) {
      const tableName = table.name as keyof Schema.DB;
      if (DbConfigJson.tables.includes(tableName)) continue;

      await this._db.schema.dropTable(tableName).execute();
    }
  }

  private async _generateTsInterface() {
    this._debug(`Generating TS interface from db at %s`, this._interfacePath);

    const cli = new Cli();
    await cli.run([
      `--out-file=${this._interfacePath}`,
      `--url=${this._dbPath}`,
      `--dialect=sqlite`,
    ]);
  }

  private async _formatFile(filePath: string) {
    this._debug(`Formatting file %s`, filePath);

    const fileContent = fs.readFileSync(filePath);
    const prettierConfig = await prettier.resolveConfig(filePath);
    fs.writeFileSync(
      filePath,
      prettier.format(fileContent.toString(), {
        ...prettierConfig,
        filepath: filePath,
      })
    );
  }
}

async function main() {
  try {
    const loader = new ExileDBCreator();
    await loader.buildDatabase();
  } catch (error) {
    console.error(error);
  }
}

void main();
