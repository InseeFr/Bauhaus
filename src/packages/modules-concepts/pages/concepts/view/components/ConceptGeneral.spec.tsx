import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import type { ConceptGeneral as ConceptGeneralType } from "@model/concepts/concept";

import { createQueryClientWrapper } from "../../../../testing/query-client.testing";
import { ConceptGeneral } from "./ConceptGeneral";

vi.mock("./CollectionsBlock", () => ({
  CollectionsBlock: () => null,
}));

// Mock des dépendances
const translations: Record<string, string> = {
  "concept.general.globalInformationsTitle": "Informations globales",
  "concept.general.identifiantTitle": "Identifiant",
  "concept.general.altLabelTitle": "Libellé alternatif",
  "concept.general.createdDateTitle": "Date de création",
  "concept.general.modifiedDateTitle": "Date de modification",
  "concept.general.validDateTitle": "Date de validité",
  "concept.general.conceptVersionTitle": "Version du concept",
  "concept.general.creatorTitle": "Créateur",
  "concept.general.contributorTitle": "Gestionnaire",
  "concept.general.disseminationStatusTitle": "Statut de diffusion",
  "concept.general.isConceptValidTitle": "État du concept",
  "concept.general.conceptStatusProvisional": "Provisoire",
  "concept.general.conceptStatusValid": "Validé",
  "concept.general.additionalMaterialTitle": "Document lié",
};

vi.mock("react-i18next", async (importOriginal) => {
  const { withMockedTranslation } = await import("../../../../testing/i18n.testing");
  return withMockedTranslation(await importOriginal(), {
    t: (key: string) => translations[key] ?? key,
  });
});

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

vi.mock(
  "@components/business/organizations/organizations",
  () => import("../../../../testing/organizations.testing"),
);

vi.mock("@components/dissemination-status/disseminationStatus", () => ({
  DisseminationStatusVisualization: ({ disseminationStatus }: { disseminationStatus: string }) => (
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

const renderConcept = (attr: Record<string, unknown>, secondLang?: boolean) =>
  render(
    <ConceptGeneral concept={attr as unknown as ConceptGeneralType} secondLang={secondLang} />,
    { wrapper: createQueryClientWrapper() },
  );

const expectText = (text: RegExp | string) => expect(screen.getByText(text)).toBeInTheDocument();

const expectNoText = (text: RegExp | string) =>
  expect(screen.queryByText(text)).not.toBeInTheDocument();

describe("ConceptGeneral", () => {
  describe("Rendering basic fields", () => {
    it("should render global information title", () => {
      renderConcept({ id: "c1234" });

      expectText("Informations globales");
    });

    it("should render id field", () => {
      renderConcept({ id: "c1234" });

      expectText(/Identifiant/);
      expectText(/c1234/);
    });

    it("should render concept version", () => {
      renderConcept({ conceptVersion: "2" });

      expectText(/Version du concept/);
      expectText(/Version du concept: 2/);
    });
  });

  describe("Alternative labels", () => {
    it("should render altLabelLg1 with language suffix", () => {
      renderConcept({ altLabelLg1: ["Synonym 1", "Synonym 2"] });

      expectText(/Libellé alternatif \(Fr\)/);
      expectText("Synonym 1");
      expectText("Synonym 2");
    });

    it("should render altLabelLg2 when secondLang is true", () => {
      renderConcept({ altLabelLg2: ["Alternative 1", "Alternative 2"] }, true);

      expectText(/Libellé alternatif \(En\)/);
      expectText("Alternative 1");
      expectText("Alternative 2");
    });

    it("should not render altLabelLg2 when secondLang is false", () => {
      renderConcept({ altLabelLg2: ["Alternative 1"] }, false);

      expectNoText(/Libellé alternatif \(En\)/);
    });

    it("should not render altLabel fields when empty arrays", () => {
      renderConcept({ altLabelLg1: [], altLabelLg2: [] });

      expectNoText(/Libellé alternatif/);
    });
  });

  describe("Date fields", () => {
    it("should render created and modified dates", () => {
      renderConcept({ created: "2024-01-15", modified: "2024-02-20" });

      expectText(/Date de création/);
      expectText(/15\/01\/2024/);
      expectText(/Date de modification/);
      expectText(/20\/02\/2024/);
    });

    it("should render valid date when present", () => {
      renderConcept({ valid: "2024-12-31" });

      expectText(/Date de validité/);
      expectText(/31\/12\/2024/);
    });

    it("should not render valid date field when not present", () => {
      renderConcept({ created: "2024-01-15" });

      expectNoText(/Date de validité/);
    });
  });

  describe("Creator and contributor fields", () => {
    it("should render creator field with mapped label", () => {
      renderConcept({ creator: "DG75-L201" });

      expectText(/Créateur/);
      expectText(/INSEE/);
    });

    it("should render contributor field with mapped label", () => {
      renderConcept({ contributor: "DG75-L202" });

      expectText(/Gestionnaire/);
      expectText(/DARES/);
    });

    it("should render multiple creators with mapped labels", () => {
      renderConcept({ creator: ["DG75-L201", "DG75-L202"] });

      expectText(/Créateur/);
    });

    it("should render creators as list items when multiple", () => {
      renderConcept({ creator: ["DG75-L201", "DG75-L202"] });

      // Vérifie que le champ créateur est rendu
      expectText(/Créateur/);

      // Vérifie la présence de listes (comportement)
      expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
    });

    it("should render multiple contributors with mapped labels", () => {
      renderConcept({ contributor: ["DG75-L201", "DG75-L202"] });

      expectText(/Gestionnaire/);

      // Vérifie la présence de listes via le rôle ARIA
      expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
    });

    it("should handle empty creator/contributor arrays", () => {
      renderConcept({ id: "c1234", creator: [], contributor: [] });

      // Les champs vides ne doivent pas être rendus (mais id doit être présent)
      expectText(/Identifiant/);
      expectNoText(/Créateur/);
      expectNoText(/Gestionnaire/);
    });

    it("should render single creator as list", () => {
      renderConcept({ creator: "DG75-L201" });

      expectText(/Créateur/);
      expectText(/INSEE/);

      // Vérifie qu'une liste est présente
      expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
    });
  });

  describe("Validation status (#1507 — aligned with series/operations vocabulary)", () => {
    // Assertions use the English labels because happy-dom defaults navigator.language to "en-US",
    // which selects D2 inside the shared @components/status helpers. Other tests in this file
    // mock `t()` so they keep showing French.

    it('renders an unvalidated concept as "Provisional"', () => {
      renderConcept({ validationState: "Unpublished" });

      expectText(/État du concept/);
      expectText(/Provisional/);
      expectNoText(/never published/i);
    });

    it('renders a validated concept as "Published" (matching séries/opérations)', () => {
      renderConcept({ validationState: "Validated" });

      expectText(/État du concept/);
      expectText(/Published/);
    });

    it('renders a modified concept as "Provisional, already published"', () => {
      renderConcept({ validationState: "Modified" });

      expectText(/État du concept/);
      expectText(/Provisional, already published/);
    });
  });

  describe("Dissemination status", () => {
    it("should render dissemination status component", () => {
      renderConcept({ disseminationStatus: "Public" });

      expectText(/Statut de diffusion : Public/);
    });
  });

  describe("Additional material", () => {
    it("should render additional material as external link", () => {
      renderConcept({ additionalMaterial: "https://example.com/doc.pdf" });

      expectText(/Document lié/);
      expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com/doc.pdf");
    });

    it("should not render additional material field when not present", () => {
      renderConcept({ id: "c1234" });

      expectNoText(/Document lié/);
    });
  });

  describe("Complete rendering", () => {
    it("should render all fields when all data is provided", () => {
      renderConcept(
        {
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
          validationState: "Validated",
          additionalMaterial: "https://example.com/doc.pdf",
        },
        true,
      );

      // Vérifier que tous les champs principaux sont présents
      [
        "Informations globales",
        /Identifiant/,
        /c1234/,
        /Libellé alternatif \(Fr\)/,
        /Libellé alternatif \(En\)/,
        /Date de création/,
        /Date de modification/,
        /Date de validité/,
        /Version du concept/,
        /Créateur/,
        /INSEE/,
        /Gestionnaire/,
        /DARES/,
        /Statut de diffusion : Public/,
        /État du concept/,
        /Published/,
        /Document lié/,
      ].forEach(expectText);
    });

    it("should handle minimal data gracefully", () => {
      renderConcept({});

      // Vérifie que le composant se rend sans erreur
      expectText("Informations globales");
    });
  });

  describe("Accessibility", () => {
    it("should render lists with proper ARIA roles", () => {
      renderConcept({
        id: "c1234",
        creator: ["DG75-L201", "DG75-L202"],
        contributor: "DG75-L201",
      });

      // Vérifie que les listes et leurs items sont accessibles via leur rôle
      expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
      expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
    });

    it("should render links with proper accessibility attributes", () => {
      renderConcept({ id: "c1234", additionalMaterial: "https://example.com/document.pdf" });

      // Vérifie que le lien est accessible
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://example.com/document.pdf");
    });

    it("should render text content that is screen reader accessible", () => {
      renderConcept({
        id: "c1234",
        creator: "DG75-L201",
        validationState: "Validated",
        created: "2024-01-01",
      });

      // Vérifie que le texte important est visible et accessible
      expect(screen.getByText("Informations globales")).toBeVisible();
      expect(screen.getByText(/Créateur/)).toBeVisible();
      expect(screen.getByText(/Published/)).toBeVisible();
      expect(screen.getByText(/Identifiant/)).toBeVisible();
    });
  });

  describe("Edge cases", () => {
    it("should handle validationState as undefined", () => {
      renderConcept({ id: "c1234", creator: "DG75-L201", validationState: undefined });

      // validationState undefined ne doit pas être rendu
      expectNoText(/État du concept/);
      expectNoText(/Provisoire/);
      expectNoText(/Validé/);
    });

    it("should handle conceptVersion as undefined", () => {
      renderConcept({ id: "c1234", conceptVersion: undefined });

      // conceptVersion undefined ne doit pas être rendu
      expectNoText(/Version du concept/);
    });

    it("should handle invalid dates gracefully", () => {
      renderConcept({
        id: "c1234",
        created: "invalid-date",
        modified: "2024-13-45", // Date invalide
      });

      // Le composant doit se rendre sans erreur
      expectText(/Identifiant/);
    });

    it("should handle malformed URL in additionalMaterial", () => {
      renderConcept({ id: "c1234", additionalMaterial: "not-a-valid-url" });

      // Le lien doit être rendu même avec une URL invalide
      expectText(/Document lié/);
      expect(screen.getByRole("link")).toHaveAttribute("href", "not-a-valid-url");
    });

    it("should handle very long altLabel arrays", () => {
      renderConcept({
        id: "c1234",
        altLabelLg1: Array.from({ length: 50 }, (_, i) => `Synonym ${i + 1}`),
      });

      // Le composant doit gérer de grands tableaux sans erreur
      expectText(/Libellé alternatif \(Fr\)/);
    });

    it("should handle special characters in text fields", () => {
      renderConcept({ id: "c<1234>", conceptVersion: "v1.0-beta", creator: "Org & Co." });

      // Les caractères spéciaux doivent être gérés correctement
      expectText(/Identifiant/);
      expectText(/Version du concept/);
    });

    it("should handle whitespace-only strings as empty", () => {
      renderConcept({ id: "   ", conceptVersion: "\t\n", creator: "   " });

      // Les chaînes contenant uniquement des espaces doivent être traitées comme vides
      expectNoText(/Identifiant/);
      expectNoText(/Version du concept/);
      expectNoText(/Créateur/);
    });

    it("should handle arrays with mixed valid and invalid values", () => {
      renderConcept({
        id: "c1234",
        creator: ["DG75-L201", "", null, undefined, "   ", "DG75-L202"],
      });

      // Le composant doit filtrer les valeurs invalides
      expectText(/Créateur/);
    });

    it("should handle extremely long text in all fields", () => {
      const longText = "A".repeat(1000);
      renderConcept({ id: longText, conceptVersion: longText });

      // Le composant doit gérer les longs textes sans erreur
      expectText(/Identifiant/);
      expectText(/Version du concept/);
    });
  });
});
