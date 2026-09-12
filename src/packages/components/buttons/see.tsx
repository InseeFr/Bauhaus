import { useTranslation } from "react-i18next";

import { componentsI18n } from "../i18n";

interface SeeButtonTypes {
  onClick: (e: any) => void;
  disabled?: boolean;
}

export const SeeButton = (props: Readonly<SeeButtonTypes>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return (
    <button
      {...props}
      type="button"
      className="btn btn-default"
      aria-label={t("see")}
      title={t("see")}
    >
      <span className="glyphicon glyphicon-eye-open"></span>
    </button>
  );
};
