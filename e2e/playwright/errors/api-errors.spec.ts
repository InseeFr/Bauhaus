import { expect, Page, Route, test } from "@playwright/test";

/**
 * Contrat d'erreur de bout en bout (ADR-1264, ticket 19b) : le back est simulé par `page.route`
 * avec les corps qu'il produit réellement (`ApiError`), et l'on vérifie ce que l'utilisateur lit.
 *
 * Écran de référence : la création d'une famille d'opérations, seul écran à la fois branché sur
 * les erreurs sous les champs (`toFormErrors`) et sur le bandeau (`ErrorBloc`).
 */

const FAMILY_CREATION = "**/api/operations/family";

const openFamilyCreation = async (page: Page) => {
  await page.goto("/operations/families");
  await expect(page.getByRole("heading", { name: "Families - Search" })).toBeVisible();
  await page.getByRole("link", { name: "New" }).click();
  await page.getByLabel("Intitulé*").fill("Famille e2e en erreur");
  await page.getByLabel("Title*").fill("Failing e2e family");
};

/** Le POST de création répond `answer` ; les autres appels passent au vrai back. */
const failFamilyCreation = async (page: Page, answer: (route: Route) => Promise<void>) => {
  await page.route(FAMILY_CREATION, (route) =>
    route.request().method() === "POST" ? answer(route) : route.continue(),
  );
};

const apiError = (status: number, body: Record<string, unknown>) => (route: Route) =>
  route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

const save = (page: Page) => page.getByRole("button", { name: "Save" }).click();

const expectBanner = async (page: Page, text: string) => {
  await expect(page.getByRole("alert").filter({ hasText: text }).first()).toBeVisible();
};

test("une erreur de validation 400 s'affiche sous le champ fautif", async ({ page }) => {
  await failFamilyCreation(
    page,
    apiError(400, {
      message: "The submitted data is invalid",
      code: "INVALID_REQUEST_BODY",
      errors: [{ field: "prefLabelLg1", message: "Ce champ est obligatoire." }],
    }),
  );
  await openFamilyCreation(page);

  await save(page);

  await expect(page.getByLabel("Intitulé*")).toHaveAccessibleDescription(
    "Ce champ est obligatoire.",
  );
});

test("un refus 403 affiche le message du serveur", async ({ page }) => {
  await failFamilyCreation(
    page,
    apiError(403, { message: "You are not allowed to perform this action.", code: "FORBIDDEN" }),
  );
  await openFamilyCreation(page);

  await save(page);

  await expectBanner(page, "You are not allowed to perform this action.");
});

test("une panne 500 invite à contacter l'équipe avec le message du serveur", async ({ page }) => {
  await failFamilyCreation(
    page,
    apiError(500, {
      message: "An unexpected error occurred. Please try again later.",
      code: "INTERNAL_SERVER_ERROR",
    }),
  );
  await openFamilyCreation(page);

  await save(page);

  await expectBanner(
    page,
    "An error has occurred. Please contact the RMéS administration team and provide them with the following message: An unexpected error occurred. Please try again later.",
  );
});

test("un serveur injoignable est signalé comme tel", async ({ page }) => {
  await failFamilyCreation(page, (route) => route.abort("failed"));
  await openFamilyCreation(page);

  await save(page);

  await expectBanner(page, "The server cannot be reached. Check your connection and try again.");
});
