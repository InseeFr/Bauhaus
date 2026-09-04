import { useTranslation } from "react-i18next";

import { PageTitle } from "@components/page-title";

import { componentsI18n } from "../i18n";

export const NotFound = ({ label }: Readonly<{ label?: string }>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return (
    <div className="container not-found">
      <PageTitle title={label ?? t("notFoundTitle")} />
    </div>
  );
};

export const UnderMaintenance = () => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return <NotFound label={t("underMaintenanceTitle")} />;
};
