import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import { componentsI18n } from "../../i18n";
import { OrganizationInput, StampsInput } from "../stamps-input/stamps-input";

type ContributorsInputProps = Readonly<
  Omit<ComponentProps<typeof StampsInput>, "labelSingle" | "labelMulti" | "lang"> & {
    lang?: "first" | "default";
    mode?: "stamp" | "organization";
  }
>;

export const ContributorsInput = ({
  lang = "first",
  mode = "stamp",
  ...props
}: ContributorsInputProps) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  const title = t("contributors.title", lang === "first" ? undefined : { lng: "en" });

  if (mode === "organization") {
    return <OrganizationInput labelSingle={title} labelMulti={title} lang={lang} {...props} />;
  }

  return <StampsInput labelSingle={title} labelMulti={title} lang={lang} {...props} />;
};
