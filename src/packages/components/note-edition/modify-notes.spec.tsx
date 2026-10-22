import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ModifyNotes } from "./modify-notes";

const note = "<p>Une <strong>note</strong> en <em>HTML</em>.</p><ul><li>a</li><li>b</li></ul>";

const editor = () => screen.getByRole("textbox");

describe("modify-notes", () => {
  it("edits the note with the markdown editor used in the rest of the application", () => {
    const { container } = render(<ModifyNotes handleChange={vi.fn()} note={note} />);

    expect(container.querySelector(".w-md-editor")).not.toBeNull();
  });

  it("shows the stored html note as markdown", () => {
    render(<ModifyNotes handleChange={vi.fn()} note={note} />);

    expect(editor()).toHaveValue("Une **note** en *HTML*.\n\n* a\n* b");
  });

  it("does not report any change for a note reopened untouched", () => {
    const handleChange = vi.fn();
    render(<ModifyNotes handleChange={handleChange} note={note} />);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("gives back html when the note is completed", async () => {
    const handleChange = vi.fn();
    render(<ModifyNotes handleChange={handleChange} note="<p>début</p>" />);

    await userEvent.type(editor(), " et **fin**");

    expect(handleChange).toHaveBeenLastCalledWith("<p>début et <strong>fin</strong></p>");
  });

  it("gives back the stored html unchanged when the markdown comes back to it", async () => {
    const handleChange = vi.fn();
    const stored = "<p>a<br>b</p><p><br></p><p>c</p>";
    render(<ModifyNotes handleChange={handleChange} note={stored} />);

    await userEvent.type(editor(), "x");
    await userEvent.type(editor(), "{Backspace}");

    expect(handleChange).toHaveBeenLastCalledWith(stored);
  });

  it("gives back an empty note when the editor is emptied", async () => {
    const handleChange = vi.fn();
    render(<ModifyNotes handleChange={handleChange} note="<p>a</p>" />);

    await userEvent.clear(editor());

    expect(handleChange).toHaveBeenLastCalledWith("");
  });

  it("offers the numbered list", () => {
    render(<ModifyNotes handleChange={vi.fn()} note="" />);

    expect(screen.getByRole("button", { name: /^add ordered list/i })).toBeInTheDocument();
  });

  it("names the editor", () => {
    render(<ModifyNotes handleChange={vi.fn()} note="" ariaLabel="Définition" />);

    expect(screen.getByRole("textbox", { name: "Définition" })).toBeInTheDocument();
  });
});
