import { readFileSync } from "fs";
import path from "path";

import { Language } from "./Language";

export interface WorldArea {
  /**
   * The unique Id of this area
   */
  Id: string;

  /**
   * Localized name
   */
  Name: string;

  IsTown: boolean;
  HasWaypoint: boolean;
  IsMapArea: boolean;
  IsHideout: boolean;
  IsVaalArea: boolean;
  IsLabyrinthAirlock: boolean;
  IsLabyrinthArea: boolean;
  IsUniqueMapArea: boolean;
  IsLabyrinthBossArea: boolean;

  AreaLevel: number;
  Act: number;
}

const areaDict: Partial<Record<Language, Map<string, WorldArea>>> = {};

/**
 * Retrieves the world area by id
 *
 * @param id The world area id as defined in the PoE .ggpk
 * @param language The language for localization
 * @returns The world area
 */
export function getWorldAreaById(id: string, language: Language): Readonly<WorldArea> | undefined {
  if (!id) return;

  // Lazy caching
  if (!(language in areaDict)) cacheAreasForLanguage(language);

  const areas = areaDict[language];
  return areas?.get(id);
}

function cacheAreasForLanguage(language: Language) {
  const map = new Map<string, WorldArea>();

  const file = readFileSync(
    path.join(__dirname, "../resources/worldAreas", `WorldAreas_${language}.json`),
    "utf8"
  );
  const data = JSON.parse(file) as Array<WorldArea>;

  for (const entry of data) {
    const area: WorldArea = {
      Id: entry.Id,
      Name: entry.Name,
      IsTown: entry.IsTown,
      HasWaypoint: entry.HasWaypoint,
      IsMapArea: entry.IsMapArea,
      IsHideout: entry.IsHideout,
      IsVaalArea: entry.IsVaalArea,
      IsLabyrinthAirlock: entry.IsLabyrinthAirlock,
      IsLabyrinthArea: entry.IsLabyrinthArea,
      IsUniqueMapArea: entry.IsUniqueMapArea,
      IsLabyrinthBossArea: entry.IsLabyrinthBossArea,
      AreaLevel: entry.AreaLevel,
      Act: entry.Act,
    };
    Object.freeze(area);
    map.set(entry.Id, area);
  }

  areaDict[language] = map;
}

/**
 * Searches for the world area by name.
 *
 * @param name Localized area name
 * @returns Found world areas
 *
 * @remarks There might be more than one result because maps, for example,
 * are present in different tiers but share the same name.
 */
export function getWorldAreaByName(name: string, language: Language): Array<Readonly<WorldArea>> {
  if (!name) return [];

  // Lazy caching
  if (!(language in areaDict)) cacheAreasForLanguage(language);

  const areas = areaDict[language];
  if (!areas) return [];

  return Array.from(areas.values()).filter((area) => area.Name == name);
}
