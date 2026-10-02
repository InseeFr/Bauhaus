import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ComponentDefinition } from "@model/structures/Component";

import { ComponentSpecificationModal } from "./ComponentSpecificationModal";

describe("<ComponentSpecificationModal />", () => {
  const specification = {
    required: true,
    attachment: ["http:/purl.org/linked-data/cube#DataSet"],
  };

  const renderModal = (props: { onClose?: VoidFunction; onSave?: VoidFunction } = {}) =>
    render(
      <ComponentSpecificationModal
        specification={specification}
        selectedComponent={{ component: {} } as unknown as ComponentDefinition}
        structureComponents={[]}
        onClose={props.onClose ?? vi.fn()}
        onSave={props.onSave ?? vi.fn()}
      />,
    );

  it("is a dialog named by its title", () => {
    renderModal();

    expect(
      screen.getByRole("dialog", { name: /componentSpecification|spécification|specification/i }),
    ).toBeInTheDocument();
  });

  it("should call the onClose prop", async () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    await userEvent.click(screen.getByRole("button", { name: /close|fermer/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("should call the onSave prop with the specification", async () => {
    const onSave = vi.fn();
    renderModal({ onSave });

    await userEvent.click(screen.getByRole("button", { name: /save|sauvegarder|enregistrer/i }));

    expect(onSave).toHaveBeenCalledWith(specification);
  });
});
