import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { componentsI18n } from "../i18n";
import "./index.css";

const className = "sticky-top";

window.onload = function () {
  document.addEventListener(
    "scroll",
    function () {
      const element = document.querySelector("." + className);
      if (!element) {
        return;
      }
      if (window.scrollY > 100) {
        element.classList.add("block");
      } else {
        element.classList.remove("block");
      }
    },
    false,
  );
};

interface BackToTopTypes {
  label?: string;
}

export function BackToTop({ label }: Readonly<BackToTopTypes>) {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  const clickHandler = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const text = t("backToTop") || label;

  return (
    <button type="button" onClick={clickHandler} className={className} style={{ display: "none" }}>
      <span className="glyphicon glyphicon-chevron-up" />
      <span className="sticky-text">{text}</span>
    </button>
  );
}
