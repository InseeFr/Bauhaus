import { render, screen } from "@testing-library/react";

import { ConfirmationModal } from "./ConfirmationModal";

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const translations: Record<string, string> = {
          "app.yes": "Yes",
          "app.no": "No",
        };
        return translations[key] || key;
      },
    }),
  };
});

describe("ConfirmationModal", () => {
  it("should display two confirmation buttons", async () => {
    render(
      <ConfirmationModal isOpen={true} document={{ sims: [] }} onNo={vi.fn()} onYes={vi.fn()} />,
    );
    await screen.findByText("Yes");
    await screen.findByText("No");
  });
});
