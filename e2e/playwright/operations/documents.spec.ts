import { expect, test } from "@playwright/test";

import { uniqueLabel } from "../helpers/data";
import { selectFirstOne } from "../helpers/prime";

/**
 * Créer un lien avec une description saisie dans l'éditeur markdown, puis
 * retrouver cette description sur sa fiche.
 */
test("crée un lien décrit en markdown et affiche sa description", async ({ page }) => {
  const prefLabelLg1 = uniqueLabel("Lien");
  const description = `Description de ${prefLabelLg1}`;

  await page.goto("/operations/link/create");

  await page.getByLabel("Intitulé*").fill(prefLabelLg1);
  await page.getByLabel("Title*").fill(`${prefLabelLg1} EN`);
  await page.getByRole("textbox", { name: "Description" }).first().fill(`**${description}**`);
  await page.getByLabel("Link*").fill("https://www.insee.fr");
  await selectFirstOne(page, "Langue");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page).toHaveURL(/\/operations\/link\/[^/]+$/);
  await expect(page.getByRole("heading", { name: prefLabelLg1 })).toBeVisible();
  await expect(page.getByText(description)).toBeVisible();
});
