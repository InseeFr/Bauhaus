import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Mock, vi } from "vitest";

import { ThemesApi } from "@sdk/index";

import { ThemesList, ThemesSelect } from "./index";

vi.mock("@sdk/index", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@sdk/index")>()),
  ThemesApi: { getThemes: vi.fn() },
}));

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

const SELECTED_THEMES = ["http://theme/emp"];
const NO_THEMES: string[] = [];
const KNOWN_THEMES = ["http://theme/eco", "http://theme/emp"];
const THEMES_WITH_UNKNOWN = ["http://theme/eco", "http://theme/disparu"];

describe("themes", () => {
  beforeEach(() => {
    (ThemesApi.getThemes as Mock).mockResolvedValue([
      { uri: "http://theme/emp", label: { value: "Emploi", lang: "fr" } },
      { uri: "http://theme/eco", label: { value: "Économie", lang: "fr" } },
    ]);
  });

  describe("ThemesSelect", () => {
    it("ajoute le thème choisi à ceux déjà sélectionnés", async () => {
      const onChange = vi.fn();
      render(<ThemesSelect label="Thèmes" value={SELECTED_THEMES} onChange={onChange} />, {
        wrapper,
      });

      const field = screen.getByText("Thèmes").closest("label")!;
      fireEvent.click(field.querySelector(".p-multiselect-trigger")!);
      fireEvent.click(await screen.findByText("Économie"));

      expect(onChange).toHaveBeenCalledWith(["http://theme/emp", "http://theme/eco"]);
    });

    it("marque le champ comme obligatoire quand il l'est", () => {
      render(<ThemesSelect label="Thème" required value={NO_THEMES} onChange={vi.fn()} />, {
        wrapper,
      });

      expect(screen.getByText("Thème").closest("label")).toHaveClass("wilco-label-required");
    });
  });

  describe("ThemesList", () => {
    it("affiche le libellé de chaque thème", async () => {
      render(<ThemesList iris={KNOWN_THEMES} />, { wrapper });

      expect(await screen.findByText("Économie")).toBeInTheDocument();
      expect(screen.getByText("Emploi")).toBeInTheDocument();
    });

    it("affiche l'IRI d'un thème absent du référentiel", async () => {
      render(<ThemesList iris={THEMES_WITH_UNKNOWN} />, { wrapper });

      await screen.findByText("Économie");
      expect(screen.getByText("http://theme/disparu")).toBeInTheDocument();
    });
  });
});
