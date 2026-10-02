// @vitest-environment jsdom
// Le corps passe par DOMPurify, qui ne fonctionne plus sous happy-dom (≥ 3.4.8).
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ModalButton, ModalRmes, ModalRmesTypes } from "./modal-rmes";

const renderModal = (props: Partial<ModalRmesTypes> = {}) =>
  render(
    <ModalRmes
      id="id"
      isOpen={true}
      title="Confirmation"
      closeCancel={vi.fn()}
      modalButtons={[]}
      {...props}
    />,
  );

describe("ModalRmes", () => {
  it("est une boîte de dialogue nommée par son titre", () => {
    renderModal();

    expect(screen.getByRole("dialog", { name: "Confirmation" })).toBeInTheDocument();
  });

  it("n'affiche rien quand elle est fermée", () => {
    renderModal({ isOpen: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("bloque le scroll de la page tant qu'elle est ouverte", () => {
    renderModal();

    expect(document.body).toHaveClass("p-overflow-hidden");
  });

  it("affiche le corps HTML assaini", () => {
    renderModal({
      body: "<p>Le concept <b>Chômage</b></p><script>alert(1)</script>" as unknown as Node,
    });

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("Le concept Chômage");
    expect(dialog.querySelector("script")).toBeNull();
  });

  it("affiche le pied de page HTML", () => {
    renderModal({ footer: "<span>Attention</span>" as unknown as Node });

    expect(screen.getByText("Attention")).toBeInTheDocument();
  });

  it("déclenche l'action du bouton cliqué", async () => {
    const action = vi.fn();
    const modalButtons: ModalButton[] = [
      { label: "Valider", action, style: "primary", disabled: false },
    ];
    renderModal({ modalButtons });

    await userEvent.click(screen.getByRole("button", { name: "Valider" }));

    expect(action).toHaveBeenCalledOnce();
  });

  it("désactive un bouton désactivé", () => {
    const modalButtons: ModalButton[] = [
      { label: "Version majeure", action: vi.fn(), style: "primary", disabled: true },
    ];
    renderModal({ modalButtons });

    expect(screen.getByRole("button", { name: "Version majeure" })).toBeDisabled();
  });

  it("appelle closeCancel à la fermeture par la croix", async () => {
    const closeCancel = vi.fn();
    renderModal({ closeCancel });

    await userEvent.click(screen.getByRole("button", { name: /close|fermer/i }));

    expect(closeCancel).toHaveBeenCalledOnce();
  });
});
