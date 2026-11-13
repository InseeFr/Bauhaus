import { ReactNode } from "react";

import { Select } from "@components/select-rmes";
import { List } from "@components/ui/list";

import { Option } from "@model/SelectOption";

import { useThemes } from "@utils/hooks/themes";

interface ThemesSelectProps {
  label: ReactNode;
  value?: string[];
  onChange: (iris: string[]) => void;
  required?: boolean;
}

/** Choix multiple parmi les thèmes du référentiel (`GET /themes`) ; la valeur est une liste d'IRI. */
export const ThemesSelect = ({
  label,
  value,
  onChange,
  required = false,
}: Readonly<ThemesSelectProps>) => {
  const { data: themesOptions = [] } = useThemes();

  return (
    <label className={required ? "w-100 wilco-label-required" : "w-100"}>
      {label}
      <Select
        multi
        placeholder=""
        value={value}
        options={themesOptions as unknown as Option[]}
        onChange={onChange}
      />
    </label>
  );
};

/** Libellés des thèmes désignés par leur IRI ; un thème absent du référentiel reste lisible par son IRI. */
export const ThemesList = ({ iris }: Readonly<{ iris?: string[] }>) => {
  const { data: themesOptions = [] } = useThemes();

  return (
    <List
      items={iris ?? []}
      getContent={(iri) => themesOptions.find((theme) => theme.value === iri)?.label ?? iri}
    />
  );
};
