import { render, screen, fireEvent } from "@testing-library/react";
import { ChangeEvent, useCallback } from "react";
import { vi } from "vitest";

import { Dataset } from "@model/Dataset";

import { Notes } from "./Notes";

// Mock du composant MDEditor
vi.mock("@components/rich-editor/react-md-editor", () => ({
  MDEditor: ({
    text,
    handleChange,
  }: Readonly<{ text: string; handleChange: (value: string) => void }>) => {
    const onChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => handleChange(e.target.value),
      [handleChange],
    );
    return <textarea data-testid="md-editor" value={text} onChange={onChange} />;
  },
}));

const editingDataset = {
  abstractLg1: "Abstract 1",
  abstractLg2: "Abstract 2",
  descriptionLg1: "Description 1",
  descriptionLg2: "Description 2",
  cautionLg1: "Caution 1",
  cautionLg2: "Caution 2",
} as Dataset;

describe("Notes component", () => {
  it("should render all textareas with initial values", () => {
    render(<Notes editingDataset={editingDataset} setEditingDataset={vi.fn()} />);

    const editors = screen.getAllByTestId("md-editor");
    expect(editors).toHaveLength(6);
    expect(editors[0]).toHaveValue("Abstract 1");
    expect(editors[1]).toHaveValue("Abstract 2");
    expect(editors[2]).toHaveValue("Description 1");
    expect(editors[3]).toHaveValue("Description 2");
    expect(editors[4]).toHaveValue("Caution 1");
    expect(editors[5]).toHaveValue("Caution 2");
  });

  it("should update dataset when text is changed", () => {
    const setEditingDataset = vi.fn();
    render(<Notes editingDataset={editingDataset} setEditingDataset={setEditingDataset} />);

    const editors = screen.getAllByTestId("md-editor");
    fireEvent.change(editors[0], { target: { value: "New Value 0" } });

    expect(setEditingDataset).toHaveBeenCalledWith({
      ...editingDataset,
      abstractLg1: "New Value 0",
    });

    fireEvent.change(editors[1], { target: { value: "New Value 1" } });

    expect(setEditingDataset).toHaveBeenCalledWith({
      ...editingDataset,
      abstractLg2: "New Value 1",
    });

    fireEvent.change(editors[2], { target: { value: "New Value 2" } });

    expect(setEditingDataset).toHaveBeenCalledWith({
      ...editingDataset,
      descriptionLg1: "New Value 2",
    });

    fireEvent.change(editors[3], { target: { value: "New Value 3" } });

    expect(setEditingDataset).toHaveBeenCalledWith({
      ...editingDataset,
      descriptionLg2: "New Value 3",
    });

    fireEvent.change(editors[4], { target: { value: "New Value 4" } });

    expect(setEditingDataset).toHaveBeenCalledWith({
      ...editingDataset,
      cautionLg1: "New Value 4",
    });

    fireEvent.change(editors[5], { target: { value: "New Value 5" } });

    expect(setEditingDataset).toHaveBeenCalledWith({
      ...editingDataset,
      cautionLg2: "New Value 5",
    });
  });
});
