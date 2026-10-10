import { fireEvent, screen, waitFor } from "@testing-library/react";
import { ChangeEvent, useCallback } from "react";
import { Mock, vi } from "vitest";

import { Dataset } from "@model/Dataset";

import { DatasetsApi } from "@sdk/datasets-api";

import { Lineage } from "./Lineage";
import { renderEditPanel } from "./panel.testing";

vi.mock("@sdk/datasets-api", () => ({
  DatasetsApi: { getAll: vi.fn() },
}));

vi.mock("@components/rich-editor/react-md-editor", () => ({
  MDEditor: ({
    text,
    handleChange,
    textareaProps,
  }: Readonly<{
    text: string;
    handleChange: (value: string) => void;
    textareaProps?: { disabled?: boolean };
  }>) => {
    const onChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => handleChange(e.target.value),
      [handleChange],
    );
    return (
      <textarea
        data-testid="md-editor"
        value={text ?? ""}
        onChange={onChange}
        disabled={textareaProps?.disabled}
      />
    );
  },
}));

const renderPanel = (dataset: Partial<Dataset>) => renderEditPanel(Lineage, dataset);

const openSources = () => {
  const group = screen.getByText("Built from").closest(".form-group")!;
  fireEvent.click(group.querySelector(".p-multiselect-trigger")!);
};

describe("Dataset lineage panel", () => {
  beforeEach(() => {
    (DatasetsApi.getAll as Mock).mockResolvedValue([
      { id: "jd1", label: "Jeu source" },
      { id: "jd2", label: "Jeu en cours d'édition" },
    ]);
  });

  it("offers every other dataset as a source, but not the edited one", async () => {
    renderPanel({ id: "jd2" });

    openSources();

    expect(await screen.findByText("Jeu source")).toBeInTheDocument();
    expect(screen.queryByText("Jeu en cours d'édition")).not.toBeInTheDocument();
  });

  it("stores the picked source datasets", async () => {
    const { setEditingDataset } = renderPanel({ id: "jd2" });

    openSources();
    fireEvent.click(await screen.findByText("Jeu source"));

    await waitFor(() =>
      expect(setEditingDataset).toHaveBeenCalledWith({
        id: "jd2",
        wasDerivedFrom: { datasets: ["jd1"] },
      }),
    );
  });

  it("displays the bilingual description of the lineage", () => {
    renderPanel({
      wasDerivedFrom: {
        datasets: ["jd1"],
        descriptionLg1: "Agrégation",
        descriptionLg2: "Aggregation",
      },
    });

    const editors = screen.getAllByTestId("md-editor");
    expect(editors[0]).toHaveValue("Agrégation");
    expect(editors[1]).toHaveValue("Aggregation");
  });

  it("keeps the description disabled until a source dataset is picked", () => {
    renderPanel({});

    for (const editor of screen.getAllByTestId("md-editor")) {
      expect(editor).toBeDisabled();
    }
    expect(
      screen.getByText("Pick at least one source dataset to describe how this one is built."),
    ).toBeInTheDocument();
  });

  it("enables the description once a source dataset is picked", () => {
    renderPanel({ wasDerivedFrom: { datasets: ["jd1"] } });

    for (const editor of screen.getAllByTestId("md-editor")) {
      expect(editor).toBeEnabled();
    }
    expect(
      screen.queryByText("Pick at least one source dataset to describe how this one is built."),
    ).not.toBeInTheDocument();
  });

  it("stores the description while keeping the source datasets", () => {
    const { setEditingDataset } = renderPanel({ wasDerivedFrom: { datasets: ["jd1"] } });

    fireEvent.change(screen.getAllByTestId("md-editor")[1], { target: { value: "Aggregation" } });

    expect(setEditingDataset).toHaveBeenCalledWith({
      wasDerivedFrom: { datasets: ["jd1"], descriptionLg2: "Aggregation" },
    });
  });
});
