import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MDEditor } from "./react-md-editor";

// La fiche SIMS monte des dizaines d'éditeurs d'un coup : si chacun lit puis réécrit le style du
// <body>, chaque montage force le navigateur à recalculer les styles de toute la page.
describe("MDEditor on mount", () => {
  it("does not read the computed style of the body", () => {
    using getComputedStyle = vi.spyOn(window, "getComputedStyle");

    render(<MDEditor text="Texte" handleChange={vi.fn()} />);

    expect(getComputedStyle).not.toHaveBeenCalledWith(document.body, null);
  });
});
