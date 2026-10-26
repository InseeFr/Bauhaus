import { useTranslation } from "react-i18next";

import { useSecondLang } from "@utils/hooks/second-lang";

import { componentsI18n } from "../i18n";
import "./index.css";

export const CheckSecondLang = () => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  const [secondLang, toggleSecondLang] = useSecondLang();

  return (
    <div className="grid bauhaus-second-lang-checkbox">
      <div className="col-12 lg:col-10 lg:col-offset-1 text-center">
        <label>
          <input type="checkbox" checked={secondLang} onChange={() => toggleSecondLang()} />{" "}
          {t("displayLg2")}
        </label>
      </div>
    </div>
  );
};
