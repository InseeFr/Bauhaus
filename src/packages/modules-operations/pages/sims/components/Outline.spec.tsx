import { screen } from "@testing-library/react";

import { renderWithRouter } from "../../../../tests/render";
import { Outline } from "./Outline";

vi.mock("../utils/isOpen", () => ({
  isOpen: (idMas: string) => idMas === "1",
}));

const metadataStructureOpened = {
  idMas: "1",
  masLabelLg1: "masLabelLg1",
  children: { 1: { idMas: "2", children: {} } },
};

const metadataStructureClosed = {
  idMas: "2",
  masLabelLg1: "masLabelLg1",
  children: { 1: { idMas: "1", children: {} } },
};

describe("Outline", () => {
  it("should displayed a collapsed block", () => {
    const { container } = renderWithRouter(
      <Outline metadataStructure={metadataStructureClosed} storeCollapseState />,
    );
    expect(container.querySelectorAll(".pi-chevron-down")).toHaveLength(1);
    expect(container.querySelectorAll(".msd-item")).toHaveLength(0);
  });

  it("should display a expanded block", () => {
    const { container } = renderWithRouter(
      <Outline metadataStructure={metadataStructureOpened} storeCollapseState />,
    );
    expect(container.querySelectorAll(".pi-chevron-up")).toHaveLength(1);
    expect(container.querySelectorAll(".msd-item")).toHaveLength(1);
  });

  it("should not store the collapse status", () => {
    const { container } = renderWithRouter(<Outline metadataStructure={metadataStructureOpened} />);
    expect(container.querySelectorAll(".pi-chevron-up")).toHaveLength(0);
    expect(container.querySelectorAll(".msd-item")).toHaveLength(0);
  });

  it("annonce l'état replié du chevron aux technologies d'assistance", () => {
    renderWithRouter(<Outline metadataStructure={metadataStructureClosed} storeCollapseState />);
    expect(screen.getByRole("button", { expanded: false })).toBeInTheDocument();
  });

  it("annonce l'état déplié du chevron aux technologies d'assistance", () => {
    renderWithRouter(<Outline metadataStructure={metadataStructureOpened} storeCollapseState />);
    expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(1);
  });
});
