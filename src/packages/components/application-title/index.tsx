import { useTranslation } from "react-i18next";

import { componentsI18n } from "../i18n";
import "./index.css";

export const ApplicationTitle = () => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return (
    <header className="application-title">
      <div className="application-title-container">
        <div className="application-title-wrapper flex">
          <h1 className="flex">
            <img src="/img/logo.svg" alt="application logo" />
            <span className="application-title-text">{t("welcome")}</span>
          </h1>
        </div>
      </div>
    </header>
  );
};
