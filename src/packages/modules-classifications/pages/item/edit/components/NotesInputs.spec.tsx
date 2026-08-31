import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NotesInputs } from "./NotesInputs";

vi.mock("@components/rich-editor/react-md-editor", () => ({
  MDEditor: ({ id, text, handleChange }: any) => (
    <textarea
      data-testid={`md-editor-${id}`}
      id={id}
      value={text}
      onChange={(e) => handleChange(e.target.value)}
    />
  ),
}));

vi.mock("../../../../i18n", () => ({
  classificationsI18n: {
    t: (key: string, options?: { lng?: string }) => {
      const translations: Record<string, Record<string, string>> = {
        fr: {
          "item.definition": "Definition (FR)",
          "item.scopeNote": "Scope Note (FR)",
          "item.coreContentNote": "Core Content (FR)",
          "item.additionalContentNote": "Additional Content (FR)",
          "item.exclusionNote": "Exclusion Note (FR)",
          "item.changeNoteLabel": "Change Note (FR)",
        },
        en: {
          "item.definition": "Definition (EN)",
          "item.scopeNote": "Scope Note (EN)",
          "item.coreContentNote": "Core Content (EN)",
          "item.additionalContentNote": "Additional Content (EN)",
          "item.exclusionNote": "Exclusion Note (EN)",
          "item.changeNoteLabel": "Change Note (EN)",
        },
      };
      const lng = options?.lng ?? "fr";
      return translations[lng]?.[key] ?? key;
    },
  },
}));

describe("NotesInputs", () => {
  it("renders nothing when note URIs are missing", () => {
    const { container } = render(
      <NotesInputs
        value={{
          definitionLg1: "Some content",
          definitionLg2: "Some content",
        }}
        onChange={() => {}}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders inputs when note URIs are provided", () => {
    render(
      <NotesInputs
        value={{
          definitionLg1: "Content Lg1",
          definitionLg2: "Content Lg2",
          definitionLg1Uri: "uri-1",
          definitionLg2Uri: "uri-2",
        }}
        onChange={() => {}}
      />,
    );

    expect(screen.getByLabelText("Definition (FR)")).toBeInTheDocument();
    expect(screen.getByLabelText("Definition (EN)")).toBeInTheDocument();
  });

  it("calls onChange when the user edits Lg1 content", () => {
    const handleChange = vi.fn();

    render(
      <NotesInputs
        value={{
          scopeNoteLg1: "Initial FR",
          scopeNoteLg2: "Initial EN",
          scopeNoteLg1Uri: "uri-1",
          scopeNoteLg2Uri: "uri-2",
        }}
        onChange={handleChange}
      />,
    );

    const textarea = screen.getByTestId("md-editor-scopeNoteLg1");
    fireEvent.change(textarea, { target: { value: "Updated FR" } });

    expect(handleChange).toHaveBeenCalledWith({
      scopeNoteLg1: "Updated FR",
      scopeNoteLg2: "Initial EN",
    });
  });

  it("calls onChange when the user edits Lg2 content", () => {
    const handleChange = vi.fn();

    render(
      <NotesInputs
        value={{
          changeNoteLg1: "FR content",
          changeNoteLg2: "EN content",
          changeNoteLg1Uri: "uri-1",
          changeNoteLg2Uri: "uri-2",
        }}
        onChange={handleChange}
      />,
    );

    const textarea = screen.getByTestId("md-editor-changeNoteLg2");
    fireEvent.change(textarea, { target: { value: "Updated EN" } });

    expect(handleChange).toHaveBeenCalledWith({
      changeNoteLg1: "FR content",
      changeNoteLg2: "Updated EN",
    });
  });
});
