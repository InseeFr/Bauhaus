import { screen } from "@testing-library/react";
import { expect } from "vitest";

import { appI18n } from "../i18n";

/**
 * Assertions sur l'échec de chargement d'une fiche (`LoadingErrorBloc`), à combiner avec un rejet
 * réaliste de `sdk-rejection.testing.ts`.
 *
 * Les textes sont lus dans le catalogue partagé (`errors.loading.*`) : un écran se teste sur
 * « introuvable » ou « impossible de charger », pas sur la formulation ni le rendu du message,
 * qui peut changer sans toucher aux tests des écrans.
 */

const escapeRegExp = (text: string) => text.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

// Le titre peut être suivi du détail (message du serveur ou repli) dans le même élément.
const loadFailedText = () => new RegExp(escapeRegExp(appI18n.t("errors.loading.failed")));

/** L'écran annonce que la fiche n'existe pas (404). */
export const expectItemNotFound = async () =>
  expect(await screen.findByText(appI18n.t("errors.loading.notFound"))).toBeInTheDocument();

/** L'écran annonce que la fiche n'a pas pu être chargée (panne, erreur réseau…). */
export const expectItemLoadFailed = async () =>
  expect(await screen.findByText(loadFailedText())).toBeInTheDocument();

/** Aucun échec de chargement n'est annoncé. */
export const expectNoLoadFailure = () =>
  expect(screen.queryByText(loadFailedText())).not.toBeInTheDocument();
