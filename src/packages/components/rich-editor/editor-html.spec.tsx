import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EditorHTML } from ".";

// Une note telle que le formulaire la reçoit : déjà passée par `rmesHtmlToRawHtml`.
const note =
  "<p>Un <strong>gras</strong> et un <em>italique</em>.</p>" +
  "<ul><li>puce un</li><li>puce deux</li></ul>" +
  "<ol><li>premier</li><li>second</li></ol>" +
  "<p>fin</p>";

describe("editor-html", () => {
  it("affiche la note avec ses listes, son gras et son italique", async () => {
    render(<EditorHTML text={note} handleChange={vi.fn()} smart />);

    expect(await screen.findByText("gras")).toBeInTheDocument();
    expect(screen.getByText("gras").closest("strong")).not.toBeNull();
    expect(screen.getByText("italique").closest("em")).not.toBeNull();
    expect(screen.getByText("puce deux")).toBeInTheDocument();
    expect(screen.getByText("second")).toBeInTheDocument();
  });

  it("ne signale aucune modification d'une note rouverte sans y toucher", async () => {
    const handleChange = vi.fn();
    render(<EditorHTML text={note} handleChange={handleChange} smart />);

    await screen.findByText("gras");

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("garde listes, gras et italique à l'identique quand on complète la note", async () => {
    const handleChange = vi.fn();
    render(<EditorHTML text={note} handleChange={handleChange} smart />);

    await userEvent.type(await screen.findByText("fin"), " !");

    await waitFor(() =>
      expect(handleChange).toHaveBeenLastCalledWith(note.replace("fin", "fin !")),
    );
  });

  it("garde les lignes vides d'une note qu'on complète", async () => {
    const handleChange = vi.fn();
    const withBlankLine = "<p>avant</p><p><br></p><p>après</p>";
    render(<EditorHTML text={withBlankLine} handleChange={handleChange} smart />);

    await userEvent.type(await screen.findByText("après"), " !");

    await waitFor(() =>
      expect(handleChange).toHaveBeenLastCalledWith("<p>avant</p><p><br></p><p>après !</p>"),
    );
  });

  it("expose une zone de saisie nommée", async () => {
    render(<EditorHTML text={note} handleChange={vi.fn()} smart ariaLabel="Définition" />);

    expect(await screen.findByRole("textbox", { name: "Définition" })).toHaveTextContent("puce un");
  });

  it("vide la note d'un clic", async () => {
    const handleChange = vi.fn();
    render(<EditorHTML text={note} handleChange={handleChange} smart />);

    await userEvent.click(await screen.findByRole("button", { name: "Delete" }));

    expect(handleChange).toHaveBeenLastCalledWith("");
    expect(screen.queryByText("gras")).not.toBeInTheDocument();
  });

  it("propose le gras, l'italique et les deux sortes de listes", async () => {
    render(<EditorHTML text={note} handleChange={vi.fn()} smart />);

    expect(await screen.findByRole("button", { name: "bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "italic" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "list: bullet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "list: ordered" })).toBeInTheDocument();
  });
});
