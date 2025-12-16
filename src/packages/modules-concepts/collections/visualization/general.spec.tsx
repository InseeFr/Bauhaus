import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CollectionGeneral from "./general";

// Mock des dépendances
vi.mock("../../../deprecated-locales", () => ({
  D1: {
    globalInformationsTitle: "Informations globales",
    creatorTitle: "Créateur",
    contributorTitle: "Gestionnaire",
    isCollectionValidTitle: "État de la collection",
    collectionStatusProvisional: "Provisoire",
    collectionStatusValid: "Validé",
    descriptionTitle: "Description",
  },
  D2: {
    descriptionTitle: "Description (en)",
  },
}));

vi.mock("../../../utils/hooks/stamps", () => ({
  useV2StampsMap: () => {
    return new Map([
      ["DG75-L201", "INSEE"],
      ["DG75-L202", "DARES"],
    ]);
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("CollectionGeneral", () => {
  describe("Rendering", () => {
    it("should render global information title", () => {
      const attr = {
        created: "2024-01-01",
        modified: "2024-01-15",
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText("Informations globales")).toBeInTheDocument();
    });

    it("should render creation and update dates", () => {
      const attr = {
        created: "2024-01-01",
        modified: "2024-01-15",
      };

      const { container } = render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que le composant CreationUpdateItems est rendu
      const list = container.querySelector("ul");
      expect(list).toBeInTheDocument();
    });

    it("should render creator field with mapped label", () => {
      const attr = {
        creator: "DG75-L201",
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
      expect(screen.getByText(/INSEE/)).toBeInTheDocument();
    });

    it("should render contributor field with mapped label", () => {
      const attr = {
        contributor: "DG75-L202",
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();
      expect(screen.getByText(/DARES/)).toBeInTheDocument();
    });

    it("should render multiple creators with mapped labels", () => {
      const attr = {
        creator: ["DG75-L201", "DG75-L202"],
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
      expect(screen.getByText("INSEE")).toBeInTheDocument();
      expect(screen.getByText("DARES")).toBeInTheDocument();
    });

    it("should render creators as list items when multiple", () => {
      const attr = {
        creator: ["DG75-L201", "DG75-L202"],
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que les créateurs sont rendus avec leurs labels mappés
      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
      expect(screen.getByText("INSEE")).toBeInTheDocument();
      expect(screen.getByText("DARES")).toBeInTheDocument();

      // Vérifie la présence d'une liste (comportement, pas structure DOM)
      const lists = screen.getAllByRole("list");
      expect(lists.length).toBeGreaterThan(0);
    });

    it("should render contributor as list with mapped label", () => {
      const attr = {
        contributor: ["DG75-L201", "DG75-L202"],
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();
      expect(screen.getByText("INSEE")).toBeInTheDocument();
      expect(screen.getByText("DARES")).toBeInTheDocument();

      // Vérifie la présence d'une liste via le rôle ARIA
      const lists = screen.getAllByRole("list");
      expect(lists.length).toBeGreaterThan(0);
    });

    it("should handle empty creator/contributor arrays", () => {
      const attr = {
        creator: [],
        contributor: [],
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Les champs vides ne doivent pas être rendus
      expect(screen.queryByText("Créateur")).not.toBeInTheDocument();
      expect(screen.queryByText("Gestionnaire")).not.toBeInTheDocument();
    });

    it('should render isValidated field as "Provisoire" when false', () => {
      const attr = {
        isValidated: "false",
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/État de la collection/)).toBeInTheDocument();
      expect(screen.getByText(/Provisoire/)).toBeInTheDocument();
    });

    it('should render isValidated field as "Validé" when true', () => {
      const attr = {
        isValidated: "true",
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/État de la collection/)).toBeInTheDocument();
      expect(screen.getByText(/Validé/)).toBeInTheDocument();
    });

    it("should not render empty fields", () => {
      const attr = {
        creator: "",
        contributor: "",
      };

      const { container } = render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      const listItems = container.querySelectorAll("li");
      // Seulement les items de CreationUpdateItems devraient être présents
      expect(listItems.length).toBeLessThanOrEqual(2);
    });
  });

  describe("Description rendering", () => {
    it("should render description in first language only when secondLang is false", () => {
      const attr = {
        descriptionLg1: "Description en français",
        descriptionLg2: "Description in English",
      };

      render(<CollectionGeneral attr={attr} secondLang={false} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText("Description en français")).toBeInTheDocument();
      expect(screen.queryByText("Description in English")).not.toBeInTheDocument();
    });

    it("should render description in both languages when secondLang is true", () => {
      const attr = {
        descriptionLg1: "Description en français",
        descriptionLg2: "Description in English",
      };

      render(<CollectionGeneral attr={attr} secondLang={true} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText("Description en français")).toBeInTheDocument();
      expect(screen.getByText("Description in English")).toBeInTheDocument();
    });

    it("should not render description section when descriptionLg1 is empty", () => {
      const attr = {
        created: "2024-01-01",
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.queryByText("Description")).not.toBeInTheDocument();
    });
  });

  describe("Complete rendering", () => {
    it("should render all fields when all data is provided", () => {
      const attr = {
        created: "2024-01-01",
        modified: "2024-01-15",
        creator: "DG75-L201",
        contributor: "DG75-L202",
        isValidated: "true",
        descriptionLg1: "Description complète",
        descriptionLg2: "Complete description",
      };

      render(<CollectionGeneral attr={attr} secondLang={true} />, {
        wrapper: createWrapper(),
      });

      // Vérifier que tous les champs sont présents
      expect(screen.getByText("Informations globales")).toBeInTheDocument();
      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
      expect(screen.getByText(/INSEE/)).toBeInTheDocument();
      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();
      expect(screen.getByText(/DARES/)).toBeInTheDocument();
      expect(screen.getByText(/État de la collection/)).toBeInTheDocument();
      expect(screen.getByText(/Validé/)).toBeInTheDocument();
      expect(screen.getByText("Description complète")).toBeInTheDocument();
      expect(screen.getByText("Complete description")).toBeInTheDocument();
    });

    it("should handle minimal data gracefully", () => {
      const attr = {};

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que le composant se rend sans erreur
      expect(screen.getByText("Informations globales")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should render lists with proper ARIA roles", () => {
      const attr = {
        creator: ["DG75-L201", "DG75-L202"],
        contributor: "DG75-L201",
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que les listes sont accessibles via leur rôle
      const lists = screen.getAllByRole("list");
      expect(lists.length).toBeGreaterThan(0);

      // Vérifie que les items de liste sont présents
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThan(0);
    });

    it("should render text content that is screen reader accessible", () => {
      const attr = {
        creator: "DG75-L201",
        isValidated: "true",
        created: "2024-01-01",
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que le texte important est accessible
      expect(screen.getByText("Informations globales")).toBeVisible();
      expect(screen.getByText(/Créateur/)).toBeVisible();
      expect(screen.getByText(/Validé/)).toBeVisible();
    });
  });

  describe("Edge cases", () => {
    it("should handle isValidated as undefined", () => {
      const attr = {
        creator: "DG75-L201",
        isValidated: undefined,
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // isValidated undefined ne doit pas être rendu
      expect(screen.queryByText(/État de la collection/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Provisoire/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Validé/)).not.toBeInTheDocument();
    });

    it("should handle very long organization names", () => {
      const longOrgId = "DG75-L201-VERY-LONG-ORGANIZATION-ID-THAT-MIGHT-BREAK-LAYOUT";
      const attr = {
        creator: longOrgId,
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Le composant doit se rendre sans erreur même avec de longs identifiants
      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
    });

    it("should handle special characters in organization IDs", () => {
      const attr = {
        creator: "DG75-L201",
        contributor: "Special-Org-#123",
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Les caractères spéciaux doivent être gérés correctement
      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();
    });

    it("should handle whitespace-only strings as empty", () => {
      const attr = {
        creator: "   ",
        contributor: "\t\n",
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Les chaînes contenant uniquement des espaces doivent être traitées comme vides
      expect(screen.queryByText(/Créateur/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Gestionnaire/)).not.toBeInTheDocument();
    });

    it("should handle arrays with undefined/null values", () => {
      const attr = {
        creator: ["DG75-L201", undefined, null, "DG75-L202"] as any,
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Le composant doit gérer les valeurs nulles dans les tableaux
      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
    });

    it("should handle extremely long description text", () => {
      const longText = "A".repeat(1000);
      const attr = {
        descriptionLg1: longText,
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Le long texte doit être rendu sans erreur
      expect(screen.getByText(/Description/)).toBeInTheDocument();
    });
  });
});
