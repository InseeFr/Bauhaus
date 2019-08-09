(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (factory((global.bauhausLibrary = {}),global.react));
}(this, (function (exports,React) {
  var React__default = 'default' in React ? React['default'] : React;

  var I18NContext = React__default.createContext({});

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

    var text = React.useContext(I18NContext).backToTop || label;
    return (// eslint-disable-next-line
      React__default.createElement( 'a', { href: "#", className: "sticky-top", style: {
        display: "none"
      } },
        React__default.createElement( 'span', { className: "glyphicon glyphicon-chevron-up" }),
        React__default.createElement( 'span', { 'data-i18n': "footer.sticky-top.texte", className: "sticky-text" },
          text
        )
      )
    );
  }

  exports.BackToTop = BackToTop;
  exports.I18NContext = I18NContext;

})));
//# sourceMappingURL=index.umd.js.map
