import { render, screen } from "@testing-library/react";

import { ComponentProps } from "react";

import { PublicationStatusItem } from "./PublicationStatusItem";

const renderItem = (props: ComponentProps<typeof PublicationStatusItem>) =>
  render(
    <ul>
      <PublicationStatusItem {...props} />
    </ul>,
  );

describe("<PublicationStatusItem />", () => {
  it("affiche le label suivi du libellé masculin par défaut", () => {
    renderItem({ label: "Statut", object: { validationState: "Validated" } });
    expect(screen.getByRole("listitem")).toHaveTextContent("Statut : Published");
  });

  it("utilise le libellé féminin quand gender vaut female", () => {
    renderItem({ label: "Statut", object: { validationState: "Unpublished" }, gender: "female" });
    expect(screen.getByRole("listitem")).toHaveTextContent("Statut : Provisional");
  });

  it("retombe sur Provisoire quand validationState est absent", () => {
    renderItem({ label: "Statut", object: {} });
    expect(screen.getByRole("listitem")).toHaveTextContent("Statut : Provisional");
  });
});
