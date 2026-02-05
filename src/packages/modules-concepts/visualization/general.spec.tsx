import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConceptGeneral from "./general";

// Mock des dépendances
vi.mock("../../deprecated-locales", () => ({
  D1: {
    globalInformationsTitle: "Informations globales",
    identifiantTitle: "Identifiant",
    altLabelTitle: "Synonyme",
    createdDateTitle: "Date de création",
    modifiedDateTitle: "Date de modification",
    validDateTitle: "Date de validité",
    conceptVersionTitle: "Version du concept",
    creatorTitle: "Créateur",
    contributorTitle: "Gestionnaire",
    disseminationStatusTitle: "Statut de diffusion",
    isConceptValidTitle: "État du concept",
    conceptStatusProvisional: "Provisoire",
    conceptStatusValid: "Validé",
    additionalMaterialTitle: "Document lié",
  },
}));

vi.mock("@utils/hooks/useLocales", () => ({
  useLocales: () => ({
    lg1: "Fr",
    lg2: "En",
  }),
}));

vi.mock("@utils/array-utils", () => ({
  arrayToString: (arr: string[]) => arr.join(" ; "),
}));

vi.mock("@utils/date-utils", () => ({
  stringToDate: (dateStr: string) => {
    // Simple mock pour les dates
    return dateStr.split("-").reverse().join("/");
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

vi.mock("@components/dissemination-status/disseminationStatus", () => ({
  DisseminationStatusVisualisation: ({ disseminationStatus }: { disseminationStatus: string }) => (
    <span>Statut de diffusion : {disseminationStatus}</span>
  ),
}));

vi.mock("@components/link", () => ({
  ExternalLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
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

describe("ConceptGeneral", () => {
  describe("Rendering basic fields", () => {
    it("should render global information title", () => {
      const attr = {
        id: "c1234",
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText("Informations globales")).toBeInTheDocument();
    });

    it("should render id field", () => {
      const attr = {
        id: "c1234",
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Identifiant/)).toBeInTheDocument();
      expect(screen.getByText(/c1234/)).toBeInTheDocument();
    });

    it("should render concept version", () => {
      const attr = {
        conceptVersion: "2",
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Version du concept/)).toBeInTheDocument();
      expect(screen.getByText(/Version du concept: 2/)).toBeInTheDocument();
    });
  });

  describe("Alternative labels", () => {
    it("should render altLabelLg1 with language suffix", () => {
      const attr = {
        altLabelLg1: ["Synonym 1", "Synonym 2"],
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Synonyme \(Fr\)/)).toBeInTheDocument();
      expect(screen.getByText("Synonym 1")).toBeInTheDocument();
      expect(screen.getByText("Synonym 2")).toBeInTheDocument();
    });

    it("should render altLabelLg2 when secondLang is true", () => {
      const attr = {
        altLabelLg2: ["Alternative 1", "Alternative 2"],
      };

      render(<ConceptGeneral attr={attr} secondLang={true} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText(/Synonyme \(En\)/)).toBeInTheDocument();
      expect(screen.getByText("Alternative 1")).toBeInTheDocument();
      expect(screen.getByText("Alternative 2")).toBeInTheDocument();
    });

    it("should not render altLabelLg2 when secondLang is false", () => {
      const attr = {
        altLabelLg2: ["Alternative 1"],
      };

      render(<ConceptGeneral attr={attr} secondLang={false} />, {
        wrapper: createWrapper(),
      });

      expect(screen.queryByText(/Synonyme \(En\)/)).not.toBeInTheDocument();
    });

    it("should not render altLabel fields when empty arrays", () => {
      const attr = {
        altLabelLg1: [],
        altLabelLg2: [],
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.queryByText(/Synonyme/)).not.toBeInTheDocument();
    });
  });

  describe("Date fields", () => {
    it("should render created and modified dates", () => {
      const attr = {
        created: "2024-01-15",
        modified: "2024-02-20",
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Date de création/)).toBeInTheDocument();
      expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
      expect(screen.getByText(/Date de modification/)).toBeInTheDocument();
      expect(screen.getByText(/20\/02\/2024/)).toBeInTheDocument();
    });

    it("should render valid date when present", () => {
      const attr = {
        valid: "2024-12-31",
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Date de validité/)).toBeInTheDocument();
      expect(screen.getByText(/31\/12\/2024/)).toBeInTheDocument();
    });

    it("should not render valid date field when not present", () => {
      const attr = {
        created: "2024-01-15",
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      expect(screen.queryByText(/Date de validité/)).not.toBeInTheDocument();
    });
  });

  describe("Creator and contributor fields", () => {
    it("should render creator field with mapped label", () => {
      const attr = {
        creator: "DG75-L201",
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
      expect(screen.getByText(/INSEE/)).toBeInTheDocument();
    });

    it("should render contributor field with mapped label", () => {
      const attr = {
        contributor: "DG75-L202",
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();
      expect(screen.getByText(/DARES/)).toBeInTheDocument();
    });

    it("should render multiple creators with mapped labels", () => {
      const attr = {
        creator: ["DG75-L201", "DG75-L202"],
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
      expect(screen.getByText("INSEE")).toBeInTheDocument();
      expect(screen.getByText("DARES")).toBeInTheDocument();
    });

    it("should render creators as list items when multiple", () => {
      const attr = {
        creator: ["DG75-L201", "DG75-L202"],
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que les créateurs sont rendus avec leurs labels mappés
      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
      expect(screen.getByText("INSEE")).toBeInTheDocument();
      expect(screen.getByText("DARES")).toBeInTheDocument();

      // Vérifie la présence de listes (comportement)
      const lists = screen.getAllByRole("list");
      expect(lists.length).toBeGreaterThan(0);
    });

    it("should render multiple contributors with mapped labels", () => {
      const attr = {
        contributor: ["DG75-L201", "DG75-L202"],
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();
      expect(screen.getByText("INSEE")).toBeInTheDocument();
      expect(screen.getByText("DARES")).toBeInTheDocument();

      // Vérifie la présence de listes via le rôle ARIA
      const lists = screen.getAllByRole("list");
      expect(lists.length).toBeGreaterThan(0);
    });

    it("should handle empty creator/contributor arrays", () => {
      const attr = {
        id: "c1234",
        creator: [],
        contributor: [],
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Les champs vides ne doivent pas être rendus (mais id doit être présent)
      expect(screen.getByText(/Identifiant/)).toBeInTheDocument();
      expect(screen.queryByText(/Créateur/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Gestionnaire/)).not.toBeInTheDocument();
    });

    it("should render single creator as list", () => {
      const attr = {
        creator: "DG75-L201",
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
      expect(screen.getByText("INSEE")).toBeInTheDocument();

      // Vérifie qu'une liste est présente
      const lists = screen.getAllByRole("list");
      expect(lists.length).toBeGreaterThan(0);
    });
  });

  describe("Validation status", () => {
    it('should render isValidated as "Provisoire" when false', () => {
      const attr = {
        isValidated: "false",
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/État du concept/)).toBeInTheDocument();
      expect(screen.getByText(/Provisoire/)).toBeInTheDocument();
    });

    it('should render isValidated as "Validé" when true', () => {
      const attr = {
        isValidated: "true",
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/État du concept/)).toBeInTheDocument();
      expect(screen.getByText(/Validé/)).toBeInTheDocument();
    });
  });

  describe("Dissemination status", () => {
    it("should render dissemination status component", () => {
      const attr = {
        disseminationStatus: "Public",
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Statut de diffusion : Public/)).toBeInTheDocument();
    });
  });

  describe("Additional material", () => {
    it("should render additional material as external link", () => {
      const attr = {
        additionalMaterial: "https://example.com/doc.pdf",
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.getByText(/Document lié/)).toBeInTheDocument();
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "https://example.com/doc.pdf");
    });

    it("should not render additional material field when not present", () => {
      const attr = {
        id: "c1234",
      };

      render(<ConceptGeneral attr={attr} />, { wrapper: createWrapper() });

      expect(screen.queryByText(/Document lié/)).not.toBeInTheDocument();
    });
  });

  describe("Complete rendering", () => {
    it("should render all fields when all data is provided", () => {
      const attr = {
        id: "c1234",
        altLabelLg1: ["Synonym 1"],
        altLabelLg2: ["Alternative 1"],
        created: "2024-01-15",
        modified: "2024-02-20",
        valid: "2024-12-31",
        conceptVersion: "2",
        creator: "DG75-L201",
        contributor: "DG75-L202",
        disseminationStatus: "Public",
        isValidated: "true",
        additionalMaterial: "https://example.com/doc.pdf",
      };

      render(<ConceptGeneral attr={attr} secondLang={true} />, {
        wrapper: createWrapper(),
      });

      // Vérifier que tous les champs principaux sont présents
      expect(screen.getByText("Informations globales")).toBeInTheDocument();
      expect(screen.getByText(/Identifiant/)).toBeInTheDocument();
      expect(screen.getByText(/c1234/)).toBeInTheDocument();
      expect(screen.getByText(/Synonyme \(Fr\)/)).toBeInTheDocument();
      expect(screen.getByText(/Synonyme \(En\)/)).toBeInTheDocument();
      expect(screen.getByText(/Date de création/)).toBeInTheDocument();
      expect(screen.getByText(/Date de modification/)).toBeInTheDocument();
      expect(screen.getByText(/Date de validité/)).toBeInTheDocument();
      expect(screen.getByText(/Version du concept/)).toBeInTheDocument();
      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
      expect(screen.getByText(/INSEE/)).toBeInTheDocument();
      expect(screen.getByText(/Gestionnaire/)).toBeInTheDocument();
      expect(screen.getByText(/DARES/)).toBeInTheDocument();
      expect(screen.getByText(/Statut de diffusion : Public/)).toBeInTheDocument();
      expect(screen.getByText(/État du concept/)).toBeInTheDocument();
      expect(screen.getByText(/Validé/)).toBeInTheDocument();
      expect(screen.getByText(/Document lié/)).toBeInTheDocument();
    });

    it("should handle minimal data gracefully", () => {
      const attr = {};

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que le composant se rend sans erreur
      expect(screen.getByText("Informations globales")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should render lists with proper ARIA roles", () => {
      const attr = {
        id: "c1234",
        creator: ["DG75-L201", "DG75-L202"],
        contributor: "DG75-L201",
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que les listes sont accessibles via leur rôle
      const lists = screen.getAllByRole("list");
      expect(lists.length).toBeGreaterThan(0);

      // Vérifie que les items de liste sont présents
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThan(0);
    });

    it("should render links with proper accessibility attributes", () => {
      const attr = {
        id: "c1234",
        additionalMaterial: "https://example.com/document.pdf",
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que le lien est accessible
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://example.com/document.pdf");
    });

    it("should render text content that is screen reader accessible", () => {
      const attr = {
        id: "c1234",
        creator: "DG75-L201",
        isValidated: "true",
        created: "2024-01-01",
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Vérifie que le texte important est visible et accessible
      expect(screen.getByText("Informations globales")).toBeVisible();
      expect(screen.getByText(/Créateur/)).toBeVisible();
      expect(screen.getByText(/Validé/)).toBeVisible();
      expect(screen.getByText(/Identifiant/)).toBeVisible();
    });
  });

  describe("Edge cases", () => {
    it("should handle isValidated as undefined", () => {
      const attr = {
        id: "c1234",
        creator: "DG75-L201",
        isValidated: undefined,
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // isValidated undefined ne doit pas être rendu
      expect(screen.queryByText(/État du concept/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Provisoire/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Validé/)).not.toBeInTheDocument();
    });

    it("should handle conceptVersion as undefined", () => {
      const attr = {
        id: "c1234",
        conceptVersion: undefined,
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // conceptVersion undefined ne doit pas être rendu
      expect(screen.queryByText(/Version du concept/)).not.toBeInTheDocument();
    });

    it("should handle invalid dates gracefully", () => {
      const attr = {
        id: "c1234",
        created: "invalid-date",
        modified: "2024-13-45", // Date invalide
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Le composant doit se rendre sans erreur
      expect(screen.getByText(/Identifiant/)).toBeInTheDocument();
    });

    it("should handle malformed URL in additionalMaterial", () => {
      const attr = {
        id: "c1234",
        additionalMaterial: "not-a-valid-url",
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Le lien doit être rendu même avec une URL invalide
      expect(screen.getByText(/Document lié/)).toBeInTheDocument();
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "not-a-valid-url");
    });

    it("should handle very long altLabel arrays", () => {
      const longArray = Array.from({ length: 50 }, (_, i) => `Synonym ${i + 1}`);
      const attr = {
        id: "c1234",
        altLabelLg1: longArray,
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Le composant doit gérer de grands tableaux sans erreur
      expect(screen.getByText(/Synonyme \(Fr\)/)).toBeInTheDocument();
    });

    it("should handle special characters in text fields", () => {
      const attr = {
        id: "c<1234>",
        conceptVersion: "v1.0-beta",
        creator: "Org & Co.",
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Les caractères spéciaux doivent être gérés correctement
      expect(screen.getByText(/Identifiant/)).toBeInTheDocument();
      expect(screen.getByText(/Version du concept/)).toBeInTheDocument();
    });

    it("should handle whitespace-only strings as empty", () => {
      const attr = {
        id: "   ",
        conceptVersion: "\t\n",
        creator: "   ",
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Les chaînes contenant uniquement des espaces doivent être traitées comme vides
      expect(screen.queryByText(/Identifiant/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Version du concept/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Créateur/)).not.toBeInTheDocument();
    });

    it("should handle arrays with mixed valid and invalid values", () => {
      const attr = {
        id: "c1234",
        creator: ["DG75-L201", "", null, undefined, "   ", "DG75-L202"] as any,
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Le composant doit filtrer les valeurs invalides
      expect(screen.getByText(/Créateur/)).toBeInTheDocument();
    });

    it("should handle extremely long text in all fields", () => {
      const longText = "A".repeat(1000);
      const attr = {
        id: longText,
        conceptVersion: longText,
      };

      render(<ConceptGeneral attr={attr} />, {
        wrapper: createWrapper(),
      });

      // Le composant doit gérer les longs textes sans erreur
      expect(screen.getByText(/Identifiant/)).toBeInTheDocument();
      expect(screen.getByText(/Version du concept/)).toBeInTheDocument();
    });
  });
});
