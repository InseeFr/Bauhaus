import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import { componentsI18n } from "../../i18n";
import { OrganizationInput, StampsInput } from "../stamps-input/stamps-input";

type CreatorsInputProps = Readonly<
  Omit<ComponentProps<typeof StampsInput>, "labelSingle" | "labelMulti" | "lang"> & {
    lang?: "first" | "default";
    mode?: "stamp" | "organization";
  }
>;

export const CreatorsInput = ({ lang = "first", mode = "stamp", ...props }: CreatorsInputProps) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  const options = lang === "first" ? undefined : { lng: "en" };
  const labelSingle = t("creatorsInput.creatorTitle", options);
  const labelMulti = t("creatorsInput.creatorsTitle", options);

  if (mode === "organization") {
    return (
      <OrganizationInput labelSingle={labelSingle} labelMulti={labelMulti} lang={lang} {...props} />
    );
  }

  return <StampsInput labelSingle={labelSingle} labelMulti={labelMulti} lang={lang} {...props} />;
};
