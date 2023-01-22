export interface WorldAreas {
  _index: number | null;
  Language: string | null;
  Id: string | null;
  Name: string | null;
  Act: number | null;
  IsTown: number | null;
  HasWaypoint: number | null;
  Connections_WorldAreasKeys: string | null;
  AreaLevel: number | null;
  HASH16: number | null;
  LoadingScreen_DDSFile: string | null;
  TopologiesKeys: string | null;
  ParentTown_WorldAreasKey: number | null;
  Bosses_MonsterVarietiesKeys: string | null;
  Monsters_MonsterVarietiesKeys: string | null;
  SpawnWeight_TagsKeys: string | null;
  SpawnWeight_Values: string | null;
  IsMapArea: number | null;
  FullClear_AchievementItemsKeys: string | null;
  AchievementItemsKey: number | null;
  ModsKeys: string | null;
  VaalArea: string | null;
  MaxLevel: number | null;
  AreaTypeTags: string | null;
  IsHideout: number | null;
  Inflection: string | null;
  Tags: string | null;
  IsVaalArea: number | null;
  IsLabyrinthAirlock: number | null;
  IsLabyrinthArea: number | null;
  TwinnedFullClear_AchievementItemsKey: number | null;
  Enter_AchievementItemsKey: number | null;
  TSIFile: string | null;
  WaypointActivation_AchievementItemsKeys: string | null;
  IsUniqueMapArea: number | null;
  IsLabyrinthBossArea: number | null;
  FirstEntry_NPCTextAudioKey: number | null;
  FirstEntry_SoundEffectsKey: number | null;
  FirstEntry_NPCsKey: string | null;
  EnvironmentsKey: number | null;
}

export interface DB {
  WorldAreas: WorldAreas;
}
