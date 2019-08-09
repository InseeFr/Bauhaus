import React, { useContext } from 'react';

var I18NContext = React.createContext({});

window.onload = function () {
  document.addEventListener("scroll", function (e) {
    if (!document.querySelector(".sticky-top")) {
      return;
    }

    if (window.pageYOffset > 100) {
      document.querySelector(".sticky-top").style.display = "block";
    } else {
      document.querySelector(".sticky-top").style.display = "none";
    }
  }, false);
};

function BackToTop(ref) {
  var label = ref.label;

  var text = useContext(I18NContext).backToTop || label;
  return (// eslint-disable-next-line
    React.createElement( 'a', { href: "#", className: "sticky-top", style: {
      display: "none"
    } },
      React.createElement( 'span', { className: "glyphicon glyphicon-chevron-up" }),
      React.createElement( 'span', { 'data-i18n': "footer.sticky-top.texte", className: "sticky-text" },
        text
      )
    )
  );
}

export { BackToTop, I18NContext };
//# sourceMappingURL=index.mjs.map
