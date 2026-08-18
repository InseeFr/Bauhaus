import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CollectionGeneral, { type CollectionAttribute } from "./general";

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

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      getFixedT: (lng: "fr" | "en") => (key: string) => translations[lng][key] ?? key,
    },
  }),
}));

vi.mock("@components/business/organisations/organisations", () => ({
  InseeOrganisation: ({ creator }: { creator: string }) => {
    const labels: Record<string, string> = {
      "DG75-L201": "INSEE",
      "DG75-L202": "DARES",
    };
    return labels[creator] ?? creator;
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
      const attr: CollectionAttribute = {
        created: "2024-01-01",
        modified: "2024-01-15",
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText("Informations générales")).toBeInTheDocument();
    });

    it("should render creation and update dates", () => {
      const attr: CollectionAttribute = {
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
      const attr: CollectionAttribute = {
        creator: "DG75-L201",
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();
      expect(screen.getByText(/INSEE/)).toBeInTheDocument();
    });

    it("should render contributor field with mapped label", () => {
      const attr: CollectionAttribute = {
        contributor: "DG75-L202",
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();
      expect(screen.getByText(/DARES/)).toBeInTheDocument();
    });

    it("should render multiple creators with mapped labels", () => {
      const attr: CollectionAttribute = {
        creator: ["DG75-L201", "DG75-L202"],
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();
    });

    it("should render creators as list items when multiple", () => {
      const attr: CollectionAttribute = {
        creator: ["DG75-L201", "DG75-L202"],
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que les créateurs sont rendus
      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();

      // Vérifie la présence d'une liste (comportement, pas structure DOM)
      const lists = screen.getAllByRole("list");
      expect(lists.length).toBeGreaterThan(0);
    });

    it("should render contributor as list with mapped label", () => {
      const attr: CollectionAttribute = {
        contributor: ["DG75-L201", "DG75-L202"],
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();

      // Vérifie la présence d'une liste via le rôle ARIA
      const lists = screen.getAllByRole("list");
      expect(lists.length).toBeGreaterThan(0);
    });

    it("should handle empty creator/contributor arrays", () => {
      const attr: CollectionAttribute = {
        creator: [],
        contributor: [],
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Les champs vides ne doivent pas être rendus
      expect(screen.queryByText("Propriétaire")).not.toBeInTheDocument();
      expect(screen.queryByText("Gestionnaire")).not.toBeInTheDocument();
    });

    it('should render validationState field as "Provisional" when Unpublished', () => {
      const attr: CollectionAttribute = {
        validationState: "Unpublished",
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/État de la collection/)).toBeInTheDocument();
      expect(screen.getByText(/Provisional/)).toBeInTheDocument();
    });

    it('should render validationState field as "Published" when Validated', () => {
      const attr: CollectionAttribute = {
        validationState: "Validated",
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/État de la collection/)).toBeInTheDocument();
      expect(screen.getByText(/Published/)).toBeInTheDocument();
    });

    it("should not render empty fields", () => {
      const attr: CollectionAttribute = {
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
      const attr: CollectionAttribute = {
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
      const attr: CollectionAttribute = {
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
      const attr: CollectionAttribute = {
        created: "2024-01-01",
      };

      render(<CollectionGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.queryByText("Description")).not.toBeInTheDocument();
    });
  });

  describe("Complete rendering", () => {
    it("should render all fields when all data is provided", () => {
      const attr: CollectionAttribute = {
        created: "2024-01-01",
        modified: "2024-01-15",
        creator: "DG75-L201",
        contributor: "DG75-L202",
        validationState: "Validated",
        descriptionLg1: "Description complète",
        descriptionLg2: "Complete description",
      };

      render(<CollectionGeneral attr={attr} secondLang={true} />, {
        wrapper: createWrapper(),
      });

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
      const attr: CollectionAttribute = {};

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que le composant se rend sans erreur
      expect(screen.getByText("Informations générales")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should render lists with proper ARIA roles", () => {
      const attr: CollectionAttribute = {
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
      const attr: CollectionAttribute = {
        creator: "DG75-L201",
        validationState: "Validated",
        created: "2024-01-01",
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que le texte important est accessible
      expect(screen.getByText("Informations générales")).toBeVisible();
      expect(screen.getByText(/Propriétaire/)).toBeVisible();
      expect(screen.getByText(/Published/)).toBeVisible();
    });
  });

  describe("Edge cases", () => {
    it("should handle validationState as undefined", () => {
      const attr: CollectionAttribute = {
        creator: "DG75-L201",
        validationState: undefined,
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // validationState undefined ne doit pas être rendu
      expect(screen.queryByText(/État de la collection/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Provisoire/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Publiée/)).not.toBeInTheDocument();
    });

    it("should handle very long organization names", () => {
      const longOrgId = "DG75-L201-VERY-LONG-ORGANIZATION-ID-THAT-MIGHT-BREAK-LAYOUT";
      const attr: CollectionAttribute = {
        creator: longOrgId,
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Le composant doit se rendre sans erreur même avec de longs identifiants
      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();
    });

    it("should handle special characters in organization IDs", () => {
      const attr: CollectionAttribute = {
        creator: "DG75-L201",
        contributor: "Special-Org-#123",
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Les caractères spéciaux doivent être gérés correctement
      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();
      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();
    });

    it("should handle whitespace-only strings as empty", () => {
      const attr: CollectionAttribute = {
        creator: "   ",
        contributor: "\t\n",
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Les chaînes contenant uniquement des espaces doivent être traitées comme vides
      expect(screen.queryByText(/Propriétaire/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Gestionnaire/)).not.toBeInTheDocument();
    });

    it("should handle arrays with undefined/null values", () => {
      const attr: CollectionAttribute = {
        creator: ["DG75-L201", undefined, null, "DG75-L202"] as unknown as string[],
      };

      render(<CollectionGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Le composant doit gérer les valeurs nulles dans les tableaux
      expect(screen.getByText(/Propriétaire/)).toBeInTheDocument();
    });

    it("should handle extremely long description text", () => {
      const longText = "A".repeat(1000);
      const attr: CollectionAttribute = {
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
