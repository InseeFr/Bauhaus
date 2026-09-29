import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";

import { ThemesApi } from "@sdk/index";

type ThemeOption = { value: string; label: ReactNode };

export const useThemes = () =>
  useQuery<ThemeOption[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const themes = await ThemesApi.getThemes();
      // Le ORDER BY SPARQL relègue les libellés accentués (« Économie ») en fin de liste.
      return [...themes]
        .sort((a, b) => a.label.value.localeCompare(b.label.value, "fr"))
        .map((theme) => ({
          value: theme.uri,
          label: <>{theme.label.value}</>,
        }));
    },
  });
