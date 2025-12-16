import { useCallback } from "react";

import { createAllDictionary } from "@utils/dictionnary";

import "./index.css";

const className = "sticky-top";

const { D } = createAllDictionary({
  backToTop: {
    en: "Back to Top",
    fr: "Haut de page",
  },
});
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

export default function BackToTop({ label }: Readonly<BackToTopTypes>) {
  const clickHandler = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const text = D.backToTop || label;
  return (
    <button type="button" onClick={clickHandler} className={className} style={{ display: "none" }}>
      <span className="glyphicon glyphicon-chevron-up" />
      <span className="sticky-text">{text}</span>
    </button>
  );
}
