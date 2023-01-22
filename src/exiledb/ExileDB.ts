import path from "path";
import Debug from "debug";
import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

import * as Schema from "./schema";
import { Language } from "../models";

export class ExileDB extends Kysely<Schema.DB> {
  private static _instance: ExileDB;
  private readonly _debug: Debug.Debugger;
  private readonly _ready: Promise<void>;
  private _worldAreas: Map<Language, Map<string, Schema.WorldAreas>>;

  private constructor() {
    const dbPath = path.join(__dirname, "../resources/exiledb.db");

    const db = new Database(dbPath);

    super({
      dialect: new SqliteDialect({
        database: db,
      }),
    });

    this._debug = Debug(`poe-log-events:`).extend(this.constructor.name);
    this._debug(`Loaded DB from %s`, dbPath);

    this._ready = ExileDB._loadWorldAreas(this).then(() => this._debug(`Ready!`));
  }

  static get Instance(): ExileDB {
    if (!ExileDB._instance) {
      ExileDB._instance = new ExileDB();
    }

    return ExileDB._instance;
  }

  get Ready(): Promise<void> {
    return this._ready;
  }

  public getWorldAreaById(id: string, language = Language.English): Schema.WorldAreas | undefined {
    const areaMap = this._worldAreas.get(language);
    if (!areaMap) throw new Error(`No Entries for language ${language}`);

    return areaMap.get(id);
  }

  public getWorldAreaByName(name: string, language = Language.English): Schema.WorldAreas[] {
    const areaMap = this._worldAreas.get(language);
    if (!areaMap) throw new Error(`No Entries for language ${language}`);

    return Array.from(areaMap.values()).filter((area) => area.Name == name);
  }

  private static async _loadWorldAreas(db: ExileDB) {
    db._debug(`Caching world areas`);

    db._worldAreas = new Map();

    for (const lang of Object.keys(Language)) {
      const areaMap: Map<string, Schema.WorldAreas> = new Map();
      const areas = await db
        .selectFrom("WorldAreas")
        .selectAll()
        .where("WorldAreas.Language", "=", lang)
        .execute();

      if (!areas || areas.length == 0) throw new Error(`Failed to load areas in language ${lang}`);

      for (const area of areas) {
        if (!area.Id) throw new Error(`Invalid area ${JSON.stringify(area)}`);
        areaMap.set(area.Id, area);
      }

      db._worldAreas.set(Language[lang as keyof typeof Language], areaMap);
    }
  }
}
