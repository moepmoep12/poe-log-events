import { Language } from "../models/Language";

export function regexPerLanguage(json: Record<string, string>): Record<Language, RegExp> {
  return Object.fromEntries(
    Object.entries(json as Record<Language, string>).map(([key, val]) => [key, new RegExp(val)])
  ) as Record<Language, RegExp>;
}
