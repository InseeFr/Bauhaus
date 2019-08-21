import React, { useContext } from "react";
import I18NContext from "../i18n-provider";
import "./back-to-top.css";

window.onload = function() {
  document.addEventListener(
    "scroll",
    function(e) {
      if (!document.querySelector(".sticky-top")) {
        return;
      }
      if (window.pageYOffset > 100) {
        document.querySelector(".sticky-top").style.display = "block";
      } else {
        document.querySelector(".sticky-top").style.display = "none";
      }
    },
    false
  );
};

export default function BackToTop({ label }) {
  const text = useContext(I18NContext).backToTop || label;
  return (
    // eslint-disable-next-line
    <a href="#" className="sticky-top" style={{ display: "none" }}>
      <span className="glyphicon glyphicon-chevron-up" />
      <span data-i18n="footer.sticky-top.texte" className="sticky-text">
        {text}
      </span>
    </a>
  );
}
