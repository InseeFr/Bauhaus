import { useTranslation } from "react-i18next";

import { useSecondLang } from "@utils/hooks/second-lang";

import { componentsI18n } from "../i18n";
import "./index.css";

export const CheckSecondLang = () => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  const [secondLang, toggleSecondLang] = useSecondLang();

  return (
    <div className="row bauhaus-second-lang-checkbox">
      <div className="col-md-10 text-center col-md-offset-1">
        <label>
          <input type="checkbox" checked={secondLang} onChange={() => toggleSecondLang()} />{" "}
          {t("displayLg2")}
        </label>
      </div>
    </div>
  );
};
