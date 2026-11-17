import { vi } from "vitest";

type Translate = (key: string, options?: any) => string;

// Fabrique de mock partiel de react-i18next : tout reste réel sauf `useTranslation`.
// Usage : `vi.mock("react-i18next", async () =>
//   (await import("./translationMock.testing")).withMockedTranslation((key) => key))`.
export const withMockedTranslation = async (t: Translate) => ({
  ...(await vi.importActual<typeof import("react-i18next")>("react-i18next")),
  useTranslation: () => ({ t }),
});
