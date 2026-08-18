/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    // Le nommage des sélecteurs est hétérogène dans le code existant : BEM
    // (.msd__outline), snake_case (.layout_with_lateral_menu), camelCase
    // (.boldWhite), majuscules (.bauhaus-sims-field__RICH_TEXT) et classes
    // imposées par des libs tierces (.DraftEditor-root, .ReactModal__Overlay).
    // Les uniformiser suppose de renommer les classes côté JSX : c'est un
    // chantier à part, indépendant de la migration SCSS -> CSS.
    "selector-class-pattern": null,
    "selector-id-pattern": null,

    // Règle très bruyante en présence de nesting : elle signale l'ordre relatif
    // de sélecteurs qui ne s'appliquent pas aux mêmes éléments. Y répondre
    // imposerait de réordonner des règles, donc de risquer des régressions
    // visuelles, pour un gain nul.
    "no-descending-specificity": null,
  },
};
