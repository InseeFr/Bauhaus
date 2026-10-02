import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConfirmationDelete } from ".";

describe("ConfirmationDelete", () => {
  it("est une boîte de dialogue nommée par son titre", () => {
    render(<ConfirmationDelete handleNo={vi.fn()} handleYes={vi.fn()} message="Supprimer ?" />);

    const dialog = screen.getByRole("dialog", { name: /suppression|delete/i });
    expect(dialog).toHaveTextContent("Supprimer ?");
  });

  it("confirme la suppression", async () => {
    const handleYes = vi.fn();
    render(<ConfirmationDelete handleNo={vi.fn()} handleYes={handleYes} />);

    await userEvent.click(screen.getByRole("button", { name: /^(oui|yes)$/i }));

    expect(handleYes).toHaveBeenCalledOnce();
  });

  it("renonce par le bouton Non", async () => {
    const handleNo = vi.fn();
    render(<ConfirmationDelete handleNo={handleNo} handleYes={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /^(non|no)$/i }));

    expect(handleNo).toHaveBeenCalledOnce();
  });

  it("renonce par la croix", async () => {
    const handleNo = vi.fn();
    render(<ConfirmationDelete handleNo={handleNo} handleYes={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /close|fermer/i }));

    expect(handleNo).toHaveBeenCalledOnce();
  });
});
