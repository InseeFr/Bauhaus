import { useTranslation } from "react-i18next";

import { componentsI18n } from "../i18n";
import { Button } from "../ui/button";
import "./button.css";

interface SeeButtonTypes {
  onClick: (e: any) => void;
  disabled?: boolean;
}

export const SeeButton = (props: Readonly<SeeButtonTypes>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return (
    <Button
      {...props}
      type="button"
      className="bauhaus-icon-btn"
      icon="pi pi-eye"
      aria-label={t("see")}
      title={t("see")}
    />
  );
};
