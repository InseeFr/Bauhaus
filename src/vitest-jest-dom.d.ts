/**
 * Vitest 5 a restructuré ses types d'assertion : les matchers personnalisés s'ajoutent
 * désormais à `Matchers<R, T>`, alors que `@testing-library/jest-dom` (7.0.1, la dernière
 * version au 2026-09-10) déclare encore l'ancienne forme `Assertion<T>`. Sans ce
 * complément, `toBeInTheDocument`, `toHaveAttribute` & co. disparaissent du typage —
 * 1 884 erreurs `tsc` alors que les tests, eux, passent.
 *
 * La liste des types de paramètres doit être identique à celle de la déclaration
 * d'origine (`vitest/dist/chunks/config.d.*.d.ts`), sinon la fusion d'interfaces échoue.
 * À supprimer quand jest-dom aura suivi Vitest 5.
 */
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  > extends TestingLibraryMatchers<unknown, R> {}
}
