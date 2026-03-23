import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";

import { ThemesApi } from "@sdk/index";

type ThemeOption = { value: string; label: ReactNode };

export const useThemes = () =>
  useQuery<ThemeOption[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const themes = await ThemesApi.getThemes();
      return themes.map((theme) => ({
        value: theme.uri,
        label: (
          <>
            {theme.label.value} <i>({theme.idConceptScheme})</i>
          </>
        ),
      }));
    },
  });
