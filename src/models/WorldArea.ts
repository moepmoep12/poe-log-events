import { ExileDB } from "../exiledb/ExileDB";
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

// const areaDict: Partial<Record<Language, Map<string, WorldArea>>> = {};

/**
 * Retrieves the world area by id
 *
 * @param id The world area id as defined in the PoE .ggpk
 * @param language The language for localization
 * @returns The world area
 */
export function getWorldAreaById(id: string, language: Language): WorldArea | undefined {
  const exileDB = ExileDB.Instance;
  const result = exileDB.getWorldAreaById(id, language);
  if (!result) return;

  return {
    Act: result.Act ?? 0,
    AreaLevel: result.AreaLevel ?? 0,
    HasWaypoint: parseBool(result.HasWaypoint),
    Id: result.Id ?? "",
    IsHideout: parseBool(result.IsHideout),
    IsLabyrinthAirlock: parseBool(result.IsLabyrinthAirlock),
    IsLabyrinthArea: parseBool(result.IsLabyrinthArea),
    IsLabyrinthBossArea: parseBool(result.IsLabyrinthBossArea),
    IsMapArea: parseBool(result.IsMapArea),
    IsTown: parseBool(result.IsTown),
    IsUniqueMapArea: parseBool(result.IsUniqueMapArea),
    IsVaalArea: parseBool(result.IsVaalArea),
    Name: result.Name ?? "",
  };
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
export function getWorldAreaByName(name: string, language: Language): Array<WorldArea> {
  const exileDB = ExileDB.Instance;
  const queryResults = exileDB.getWorldAreaByName(name, language);

  return queryResults.map((result) => {
    return {
      Act: result.Act ?? 0,
      AreaLevel: result.AreaLevel ?? 0,
      HasWaypoint: parseBool(result.HasWaypoint),
      Id: result.Id ?? "",
      IsHideout: parseBool(result.IsHideout),
      IsLabyrinthAirlock: parseBool(result.IsLabyrinthAirlock),
      IsLabyrinthArea: parseBool(result.IsLabyrinthArea),
      IsLabyrinthBossArea: parseBool(result.IsLabyrinthBossArea),
      IsMapArea: parseBool(result.IsMapArea),
      IsTown: parseBool(result.IsTown),
      IsUniqueMapArea: parseBool(result.IsUniqueMapArea),
      IsVaalArea: parseBool(result.IsVaalArea),
      Name: result.Name ?? "",
    };
  });
}

function parseBool(val: number | null | string): boolean {
  return val == "true";
}
