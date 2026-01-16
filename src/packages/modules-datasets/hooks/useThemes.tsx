import { useQuery } from "@tanstack/react-query";

import { ThemesApi } from "@sdk/index";
import { Options } from "../../model/SelectOption";

export const useThemes = () =>
  useQuery<Options>({
    queryKey: ["themes"],
    queryFn: () => {
      return ThemesApi.getThemes().then((themes) =>
        themes.map((theme) => ({
          value: theme.uri,
          label: (
            <>
              {theme.label} <i>({theme.idConceptScheme})</i>
            </>
          ),
        })),
      );
    },
  });
