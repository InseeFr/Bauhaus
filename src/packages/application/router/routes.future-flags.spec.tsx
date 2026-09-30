import { render, screen } from "@testing-library/react";
import { createMemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { Routes } from "./routes";

/* Fichier séparé de routes.spec.tsx : React Router n'émet chaque « Future Flag Warning »
   qu'une fois par module, et les RouterProvider rendus dans routes.spec.tsx l'auraient
   déjà consommé avant ce test. */
describe("<Routes />", () => {
  it("opts in to React Router 7 wrapping its state updates in startTransition", async () => {
    using warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const router = createMemoryRouter([{ path: "/", element: <div>home</div> }]);

    render(<Routes router={router} />);
    await screen.findByText("home");

    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("v7_startTransition"));
  });
});
