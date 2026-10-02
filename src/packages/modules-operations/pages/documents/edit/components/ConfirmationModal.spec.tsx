import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
          "app.confirmation": "Confirmation",
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

  it("is a dialog named by its title, listing the impacted reports", () => {
    render(
      <ConfirmationModal
        isOpen={true}
        document={{ sims: [{ id: "1", labelLg1: "Rapport A" }] }}
        onNo={vi.fn()}
        onYes={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Confirmation" })).toHaveTextContent("Rapport A");
  });

  it("renders nothing when closed", () => {
    render(
      <ConfirmationModal isOpen={false} document={{ sims: [] }} onNo={vi.fn()} onYes={vi.fn()} />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onNo when closed with the cross", async () => {
    const onNo = vi.fn();
    render(<ConfirmationModal isOpen={true} document={{ sims: [] }} onNo={onNo} onYes={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /close|fermer/i }));

    expect(onNo).toHaveBeenCalledOnce();
  });
});
