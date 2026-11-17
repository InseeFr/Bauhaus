import { z } from "zod";

import { ItemGeneral } from "@model/Classification";

import { formatValidation, mandatoryAndNotEmptyTextField } from "@utils/validation";

import { classificationsI18n } from "../../../i18n";

/** Clé d'erreur du titre abrégé de longueur `length`, aussi utilisée comme `id` de sa saisie. */
export const shortLabelField = (lang: "Lg1" | "Lg2", length: string) =>
  `altLabels${lang}_${length}`;

const shortLabel = (length: string, lng: "fr" | "en") =>
  z
    .string()
    .max(Number(length), {
      error: classificationsI18n.t("item.altLabelError", { length, lng }),
    })
    .optional();

const ZodItem = (altLabels: ItemGeneral["altLabels"] = []) =>
  z.object({
    prefLabelLg1: mandatoryAndNotEmptyTextField(classificationsI18n.t("item.title", { lng: "fr" })),
    prefLabelLg2: mandatoryAndNotEmptyTextField(classificationsI18n.t("item.title", { lng: "en" })),
    ...Object.fromEntries(
      altLabels.flatMap(({ length }) => [
        [shortLabelField("Lg1", length), shortLabel(length, "fr")],
        [shortLabelField("Lg2", length), shortLabel(length, "en")],
      ]),
    ),
  });

// Chaque titre abrégé est vérifié contre sa propre longueur maximale.
export const validate = (item: ItemGeneral) =>
  formatValidation(ZodItem(item.altLabels))({
    ...item,
    ...Object.fromEntries(
      (item.altLabels ?? []).flatMap(({ length, shortLabelLg1, shortLabelLg2 }) => [
        [shortLabelField("Lg1", length), shortLabelLg1],
        [shortLabelField("Lg2", length), shortLabelLg2],
      ]),
    ),
  });
