import { ComponentPropsWithoutRef } from "react";
import { useTranslation } from "react-i18next";

import { componentsI18n } from "../i18n";
import { Button } from "../ui/button";
import "./button.css";

export const AddButton = (props: Readonly<ComponentPropsWithoutRef<"button">>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return (
    <Button
      {...props}
      type="button"
      className="bauhaus-icon-btn"
      icon="pi pi-plus"
      aria-label={t("add")}
    />
  );
};
