import { Theme } from "../model/theme";
import { buildApi } from "./build-api";

interface ThemesApiType {
  getThemes: () => Promise<Theme[]>;
}
export const ThemesApi = buildApi("themes", {
  getThemes: () => [""],
}) as unknown as ThemesApiType;
