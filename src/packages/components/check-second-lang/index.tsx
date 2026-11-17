import { useTranslation } from "react-i18next";

import { useSecondLang } from "@utils/hooks/second-lang";

import { componentsI18n } from "../i18n";
import "../layout/grid.css";
import "./index.css";

export const CheckSecondLang = () => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  const [secondLang, toggleSecondLang] = useSecondLang();

  return (
    <div className="bauhaus-grid-row bauhaus-second-lang-checkbox">
      <div className="bauhaus-grid-md-10 bauhaus-grid-md-offset-1 text-center">
        <label>
          <input type="checkbox" checked={secondLang} onChange={() => toggleSecondLang()} />{" "}
          {t("displayLg2")}
        </label>
      </div>
    </div>
  );
};
