import { renderWithRouter } from "../../../tests/render";
import Outline from "./index";

vi.mock("../../msd/utils", () => ({
  isOpen: (idMas) => idMas === "1",
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
    expect(container.querySelectorAll(".glyphicon-chevron-down")).toHaveLength(1);
    expect(container.querySelectorAll(".msd__item")).toHaveLength(0);
  });

  it("should display a expanded block", () => {
    const { container } = renderWithRouter(
      <Outline metadataStructure={metadataStructureOpened} storeCollapseState />,
    );
    expect(container.querySelectorAll(".glyphicon-chevron-up")).toHaveLength(1);
    expect(container.querySelectorAll(".msd__item")).toHaveLength(1);
  });

  it("should not store the collapse status", () => {
    const { container } = renderWithRouter(<Outline metadataStructure={metadataStructureOpened} />);
    expect(container.querySelectorAll(".glyphicon-chevron-up")).toHaveLength(0);
    expect(container.querySelectorAll(".msd__item")).toHaveLength(0);
  });
});
