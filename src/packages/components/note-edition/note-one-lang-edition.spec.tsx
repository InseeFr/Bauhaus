import { render, screen } from "@testing-library/react";

import { NoteOneLangEdition } from "./note-one-lang-edition";

describe("note-one-lang-edition", () => {
  it("renders without crashing", () => {
    render(<NoteOneLangEdition note="note" maxLength={0} handleChange={vi.fn()} />);
  });

  it("compte les caractères saisis face à la longueur maximale", () => {
    render(<NoteOneLangEdition note="<p>quatre</p>" maxLength={350} handleChange={vi.fn()} />);

    expect(screen.getByText("6 / 350")).toBeInTheDocument();
  });

  it("n'affiche pas de compteur quand la note n'a pas de longueur maximale", () => {
    render(
      <NoteOneLangEdition
        note="<p>quatre</p>"
        maxLength={Number.POSITIVE_INFINITY}
        handleChange={vi.fn()}
      />,
    );

    expect(screen.queryByText(/Infinity/)).not.toBeInTheDocument();
  });
});
