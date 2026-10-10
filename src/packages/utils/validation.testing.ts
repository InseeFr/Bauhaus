import { expect } from "vitest";

type ValidationResult = { errorMessage: string[]; fields: Record<string, string> };

type Translations = Record<string, Record<string, string>>;

type TranslationOptions = { lng?: string } & Record<string, unknown>;

/**
 * Instance i18n de remplacement pour les specs de `validate` : chaque module mocke sa
 * propre instance (`vi.mock("../../../i18n", ...)`) avec le dictionnaire minimal dont
 * son schéma a besoin. `t` lit la langue demandée (`defaultLng` à défaut), retombe sur
 * la clé quand la traduction est absente, et interpole les jetons `{{nom}}` à partir
 * des options reçues.
 */
export const i18nStub = (translations: Translations, defaultLng: string) => ({
  t: (key: string, options?: TranslationOptions) => {
    const template = translations[options?.lng ?? defaultLng]?.[key] ?? key;
    return template.replace(/{{(\w+)}}/g, (token, name: string) =>
      options && name in options ? String(options[name]) : token,
    );
  },
});

/**
 * Message rendu par `mandatoryAndNotEmpty*Field` (clé `errors.mandatoryProperty` de
 * l'instance `appI18n`, qui n'est pas mockée dans les specs de validation).
 */
export const mandatoryPropertyError = (propertyName: string) =>
  `The property <strong>${propertyName}</strong> is required.`;

/**
 * Vérifie qu'un champ fautif est signalé aux deux endroits du résultat de
 * `formatValidation` : le message est présent dans `errorMessage`, et il est porté
 * par le champ concerné dans `fields`.
 */
export const expectFieldErrors = (
  result: ValidationResult,
  errorsByField: Record<string, string>,
) => {
  Object.entries(errorsByField).forEach(([field, message]) => {
    expect(result.errorMessage).toContain(message);
    expect(result.fields[field]).toBe(message);
  });
};

/**
 * Mêmes champs que `errors`, mais tous sans message : l'état attendu de `fields`
 * quand la saisie est valide.
 */
export const withoutErrors = <Errors extends Record<string, string>>(errors: Errors) =>
  Object.fromEntries(Object.keys(errors).map((field) => [field, ""])) as Record<
    keyof Errors,
    string
  >;
