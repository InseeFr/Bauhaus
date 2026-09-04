import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import { componentsI18n } from "../i18n";
import { AddLogo } from "../logo/logo-add";

export const AddButton = (props: Readonly<ComponentProps<"button">>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return (
    <button {...props} type="button" className="btn btn-default" aria-label={t("add")}>
      <AddLogo />
    </button>
  );
};
