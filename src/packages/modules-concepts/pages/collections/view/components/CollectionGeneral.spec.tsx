import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { createQueryClientWrapper } from "../../../../testing/query-client.testing";
import { CollectionGeneral, type CollectionAttribute } from "./CollectionGeneral";

// Mock des dépendances
const translations: Record<"fr" | "en", Record<string, string>> = {
  fr: {
    "common.globalInformationsTitle": "Informations générales",
    "common.creatorTitle": "Propriétaire",
    "collection.general.contributorTitle": "Gestionnaire",
    "collection.general.isCollectionValidTitle": "État de la collection",
    "common.descriptionTitle": "Description",
  },
  en: {
    "common.descriptionTitle": "Description (en)",
  },
};

vi.mock("react-i18next", async (importOriginal) => {
  const { withMockedTranslation } = await import("../../../../testing/i18n.testing");
  return withMockedTranslation(await importOriginal(), {
    t: (key: string, tOptions?: { lng?: "fr" | "en" }) =>
      translations[tOptions?.lng ?? "fr"][key] ?? key,
    i18n: {
      getFixedT: (lng: "fr" | "en") => (key: string) => translations[lng][key] ?? key,
    },
  });
});

vi.mock(
  "@components/business/organizations/organizations",
  () => import("../../../../testing/organizations.testing"),
);

const renderGeneral = (attr: CollectionAttribute, secondLang?: boolean) =>
  render(<CollectionGeneral attr={attr} secondLang={secondLang} />, {
    wrapper: createQueryClientWrapper(),
  });

describe("CollectionGeneral", () => {
  describe("Rendering", () => {
    it("should render global information title", () => {
      renderGeneral({ created: "2024-01-01", modified: "2024-01-15" });

      expect(screen.getByText("Informations générales")).toBeInTheDocument();
    });

    it("should render creation and update dates", () => {
      const { container } = renderGeneral({ created: "2024-01-01", modified: "2024-01-15" });

      // Vérifie que le composant CreationUpdateItems est rendu
      const list = container.querySelector("ul");
      expect(list).toBeInTheDocument();
    });

    it("should render creator field with mapped label", () => {
      renderGeneral({ creator: "DG75-L201" });

      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();
      expect(screen.getByText(/INSEE/)).toBeInTheDocument();
    });

    it("should render contributor field with mapped label", () => {
      renderGeneral({ contributor: "DG75-L202" });

      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();
      expect(screen.getByText(/DARES/)).toBeInTheDocument();
    });

    it("should render multiple creators with mapped labels", () => {
      renderGeneral({ creator: ["DG75-L201", "DG75-L202"] });

      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();
    });

    it("should render creators as list items when multiple", () => {
      renderGeneral({ creator: ["DG75-L201", "DG75-L202"] });

      // Vérifie que les créateurs sont rendus
      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();

      // Vérifie la présence d'une liste (comportement, pas structure DOM)
      expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
    });

    it("should render contributor as list with mapped label", () => {
      renderGeneral({ contributor: ["DG75-L201", "DG75-L202"] });

      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();

      // Vérifie la présence d'une liste via le rôle ARIA
      expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
    });

    it("should handle empty creator/contributor arrays", () => {
      renderGeneral({ creator: [], contributor: [] });

      // Les champs vides ne doivent pas être rendus
      expect(screen.queryByText("Propriétaire")).not.toBeInTheDocument();
      expect(screen.queryByText("Gestionnaire")).not.toBeInTheDocument();
    });

    it('should render validationState field as "Provisional" when Unpublished', () => {
      renderGeneral({ validationState: "Unpublished" });

      expect(screen.getByText(/État de la collection/)).toBeInTheDocument();
      expect(screen.getByText(/Provisional/)).toBeInTheDocument();
    });

    it('should render validationState field as "Published" when Validated', () => {
      renderGeneral({ validationState: "Validated" });

      expect(screen.getByText(/État de la collection/)).toBeInTheDocument();
      expect(screen.getByText(/Published/)).toBeInTheDocument();
    });

    it("should not render empty fields", () => {
      const { container } = renderGeneral({ creator: "", contributor: "" });

      const listItems = container.querySelectorAll("li");
      // Seulement les items de CreationUpdateItems devraient être présents
      expect(listItems.length).toBeLessThanOrEqual(2);
    });
  });

  describe("Description rendering", () => {
    const bilingualDescription: CollectionAttribute = {
      descriptionLg1: "Description en français",
      descriptionLg2: "Description in English",
    };

    it("should render description in first language only when secondLang is false", () => {
      renderGeneral(bilingualDescription, false);

      expect(screen.getByText("Description en français")).toBeInTheDocument();
      expect(screen.queryByText("Description in English")).not.toBeInTheDocument();
    });

    it("should render description in both languages when secondLang is true", () => {
      renderGeneral(bilingualDescription, true);

      expect(screen.getByText("Description en français")).toBeInTheDocument();
      expect(screen.getByText("Description in English")).toBeInTheDocument();
    });

    it("should not render description section when descriptionLg1 is empty", () => {
      renderGeneral({ created: "2024-01-01" });

      expect(screen.queryByText("Description")).not.toBeInTheDocument();
    });
  });

  describe("Complete rendering", () => {
    it("should render all fields when all data is provided", () => {
      renderGeneral(
        {
          created: "2024-01-01",
          modified: "2024-01-15",
          creator: "DG75-L201",
          contributor: "DG75-L202",
          validationState: "Validated",
          descriptionLg1: "Description complète",
          descriptionLg2: "Complete description",
        },
        true,
      );

      // Vérifier que tous les champs sont présents
      expect(screen.getByText("Informations générales")).toBeInTheDocument();
      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();
      expect(screen.getByText(/INSEE/)).toBeInTheDocument();
      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();
      expect(screen.getByText(/DARES/)).toBeInTheDocument();
      expect(screen.getByText(/État de la collection/)).toBeInTheDocument();
      expect(screen.getByText(/Published/)).toBeInTheDocument();
      expect(screen.getByText("Description complète")).toBeInTheDocument();
      expect(screen.getByText("Complete description")).toBeInTheDocument();
    });

    it("should handle minimal data gracefully", () => {
      renderGeneral({});

      // Vérifie que le composant se rend sans erreur
      expect(screen.getByText("Informations générales")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should render lists with proper ARIA roles", () => {
      renderGeneral({ creator: ["DG75-L201", "DG75-L202"], contributor: "DG75-L201" });

      // Vérifie que les listes et leurs items sont accessibles via leur rôle
      expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
      expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
    });

    it("should render text content that is screen reader accessible", () => {
      renderGeneral({ creator: "DG75-L201", validationState: "Validated", created: "2024-01-01" });

      // Vérifie que le texte important est accessible
      expect(screen.getByText("Informations générales")).toBeVisible();
      expect(screen.getByText(/Propriétaire/)).toBeVisible();
      expect(screen.getByText(/Published/)).toBeVisible();
    });
  });

  describe("Edge cases", () => {
    it("should handle validationState as undefined", () => {
      renderGeneral({ creator: "DG75-L201", validationState: undefined });

      // validationState undefined ne doit pas être rendu
      expect(screen.queryByText(/État de la collection/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Provisoire/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Publiée/)).not.toBeInTheDocument();
    });

    it("should handle very long organization names", () => {
      renderGeneral({ creator: "DG75-L201-VERY-LONG-ORGANIZATION-ID-THAT-MIGHT-BREAK-LAYOUT" });

      // Le composant doit se rendre sans erreur même avec de longs identifiants
      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();
    });

    it("should handle special characters in organization IDs", () => {
      renderGeneral({ creator: "DG75-L201", contributor: "Special-Org-#123" });

      // Les caractères spéciaux doivent être gérés correctement
      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();
      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();
    });

    it("should handle whitespace-only strings as empty", () => {
      renderGeneral({ creator: "   ", contributor: "\t\n" });

      // Les chaînes contenant uniquement des espaces doivent être traitées comme vides
      expect(screen.queryByText(/Propriétaire/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Gestionnaire/)).not.toBeInTheDocument();
    });

    it("should handle arrays with undefined/null values", () => {
      renderGeneral({
        creator: ["DG75-L201", undefined, null, "DG75-L202"] as unknown as string[],
      });

      // Le composant doit gérer les valeurs nulles dans les tableaux
      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();
    });

    it("should handle extremely long description text", () => {
      renderGeneral({ descriptionLg1: "A".repeat(1000) });

      // Le long texte doit être rendu sans erreur
      expect(screen.getByText(/Description/)).toBeInTheDocument();
    });
  });
});
