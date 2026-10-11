import { describe, expect, it } from "vitest";

import { appI18n } from "../i18n";

/**
 * Codes d'erreur (`ErrorCodes` côté back) que renvoient les endpoints des rapports SIMS et des
 * territoires. Ils sont traduits par le catalogue global, lu par `ErrorBloc` : un code absent
 * s'afficherait en anglais, avec le message du serveur. 804 et 862 sont traités à part par
 * l'écran de publication.
 */
const SIMS_ERROR_CODES = [
  341, // DOCUMENT_UNKNOWN_ID
  441, // LINK_UNKNOWN_ID
  841, // SIMS_UNKNOWN_ID
  844, // SIMS_UNKNOWN_TARGET
  845, // GEOFEATURE_UNKNOWN
  846, // GEOFEATURE_INCORRECT_BODY
  847, // GEOFEATURE_EXISTING_LABEL
  861, // SIMS_INCORRECT
  863, // SIMS_EXPORT_WITHOUT_LANGUAGE
];

describe("error codes of the SIMS endpoints", () => {
  it.each(["fr", "en"])("are all translated in %s", (lng) => {
    const missing = SIMS_ERROR_CODES.filter(
      (code) => !appI18n.exists(`errors.${code}`, { lng, fallbackLng: false }),
    );

    expect(missing).toEqual([]);
  });
});
