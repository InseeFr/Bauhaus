import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as rtlRender, screen, waitFor, fireEvent } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { envelope } from "../../types/ddi4Items.testing";
import { mockClipboard } from "./codePreview.testing";
import { DdiPreview } from "./DdiPreview";

vi.mock("react-i18next", async () =>
  (await import("../representation.testing")).mockTranslations({
    "physicalInstance.view.loadingDdi": "Chargement du XML DDI...",
    "physicalInstance.view.copyCode": "Copier le code",
    "physicalInstance.view.noDdiXml": "Aucun XML DDI disponible",
  }),
);

vi.mock(
  "../../../../application/app-context",
  async () => (await import("../representation.testing")).appContextModule,
);

vi.mock("primereact/button", () => import("./codePreview.testing"));

vi.mock("primereact/dropdown", async () => {
  const { OptionsSelect } = await import("../representation.testing");
  return {
    Dropdown: ({ value, options, onChange }: any) => (
      <OptionsSelect
        data-testid="format-select"
        value={value}
        onChange={onChange}
        options={options ?? []}
      />
    ),
  };
});

vi.mock("highlight.js/lib/core", () => ({
  default: {
    getLanguage: () => null,
    registerLanguage: vi.fn(),
    highlight: (_code: string) => ({ value: _code }),
  },
}));

vi.mock("highlight.js/lib/languages/xml", () => ({
  default: vi.fn(),
}));

vi.mock("highlight.js/lib/languages/json", () => ({
  default: vi.fn(),
}));

vi.mock("highlight.js/styles/github.css", () => ({}));

vi.mock("./DdiPreview.css", () => ({}));

const mockConvertToDDI3 = vi.fn();
const mockGetPhysicalInstanceParents = vi.fn();
const mockGetGroupMissingValuesRepresentations = vi.fn();
const mockGetMutualizedCodesList = vi.fn();

vi.mock("../../../../sdk", () => ({
  DDIApi: {
    convertToDDI3: (...args: any[]) => mockConvertToDDI3(...args),
    getPhysicalInstanceParents: (...args: any[]) => mockGetPhysicalInstanceParents(...args),
    getGroupMissingValuesRepresentations: (...args: any[]) =>
      mockGetGroupMissingValuesRepresentations(...args),
    getMutualizedCodeList: (...args: any[]) => mockGetMutualizedCodesList(...args),
  },
}));

/**
 * L'aperçu résout lui-même les items seulement référencés (liste de codes réutilisée, MMVR
 * réutilisée) : il lui faut le cache react-query et les paramètres de route de la PI ouverte.
 */
const render = (ui: ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/physical-instances/fr.insee/pi-1"]}>
        <Routes>
          <Route path="/physical-instances/:agencyId/:id" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return rtlRender(ui, { wrapper });
};

/** Dernière enveloppe envoyée à la conversion : ce que l'aperçu affiche réellement. */
const lastPreviewedItems = () => mockConvertToDDI3.mock.calls.at(-1)![0].items;

const mockXml = '<?xml version="1.0"?><Variable></Variable>';

const baseProps = {
  variableId: "var-1",
  variableName: "testVar",
  variableLabel: "Test Variable",
  variableType: "text",
  isGeographic: false,
};

const missingValuesReference = {
  $type: "ManagedMissingValuesRepresentation" as const,
  URN: "urn:ddi:fr.insee:mmvr-1:1",
  Agency: "fr.insee",
  ID: "mmvr-1",
  Version: "1",
};

/** PI rattachée à un groupe sans MMVR ni liste mutualisée. */
const mockEmptyGroup = () => {
  mockGetPhysicalInstanceParents.mockResolvedValue({
    studyUnit: { agency: "fr.insee", id: "su-1" },
    group: { agency: "fr.insee", id: "grp-1" },
    stamps: [],
  });
  mockGetGroupMissingValuesRepresentations.mockResolvedValue([]);
  mockGetMutualizedCodesList.mockResolvedValue(envelope({}));
};

/** Attend qu'une conversion porte un item correspondant à `item`. */
const expectPreviewedItem = (item: Record<string, unknown>) =>
  waitFor(() => {
    expect(mockConvertToDDI3).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([expect.objectContaining(item)]),
      }),
    );
  });

describe("DdiPreview", () => {
  const defaultProps = { ...baseProps, variableDescription: "Test description" };

  beforeEach(() => {
    vi.clearAllMocks();
    mockEmptyGroup();
    mockClipboard();
  });

  it("should show loading state initially", () => {
    mockConvertToDDI3.mockImplementation(() => new Promise(() => {}));

    render(<DdiPreview {...defaultProps} />);

    expect(screen.getByText("Chargement du XML DDI...")).toBeInTheDocument();
  });

  it("should display DDI 3.3 as default format in the dropdown", () => {
    mockConvertToDDI3.mockImplementation(() => new Promise(() => {}));

    render(<DdiPreview {...defaultProps} />);

    const select = screen.getByTestId("format-select") as HTMLSelectElement;
    expect(select.value).toBe("DDI3");
  });

  it("should show both format options in the dropdown", () => {
    mockConvertToDDI3.mockImplementation(() => new Promise(() => {}));

    render(<DdiPreview {...defaultProps} />);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("DDI 3.3");
    expect(options[1]).toHaveTextContent("DDI 4.0/JSON");
  });

  it("should call convertToDDI3 with correct data", async () => {
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} />);

    await expectPreviewedItem({
      ID: "var-1",
      VariableName: [{ "@language": "fr-FR", "@value": "testVar" }],
      Label: [{ "@language": "fr-FR", "@value": "Test Variable" }],
    });
  });

  it("should tag the variable item with its $type and a schema-shaped VersionDate", async () => {
    mockConvertToDDI3.mockResolvedValue("<xml/>");

    render(<DdiPreview {...defaultProps} />);

    await waitFor(() => {
      expect(mockConvertToDDI3).toHaveBeenCalled();
    });

    const [payload] = mockConvertToDDI3.mock.calls[0];
    expect(payload.items[0]).toMatchObject({
      $type: "Variable",
      ID: "var-1",
      VersionDate: { DateTime: expect.any(String) },
    });
    expect(payload.items[0]).not.toHaveProperty("@versionDate");
  });

  it("should display XML content after loading in DDI3 mode", async () => {
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Copier le code")).toBeInTheDocument();
    });
  });

  it("should show error message when loading fails", async () => {
    mockConvertToDDI3.mockRejectedValue(new Error("API Error"));

    render(<DdiPreview {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Aucun XML DDI disponible")).toBeInTheDocument();
    });
  });

  it("should switch to DDI 4.0/JSON format when selecting it", async () => {
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} />);

    const select = screen.getByTestId("format-select") as HTMLSelectElement;
    expect(select.value).toBe("DDI3");

    fireEvent.change(select, { target: { value: "DDI4" } });

    expect(select.value).toBe("DDI4");
  });

  it("should display JSON content in DDI4 mode", async () => {
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} />);

    fireEvent.change(screen.getByTestId("format-select"), { target: { value: "DDI4" } });

    await waitFor(() => {
      const codeElement = document.querySelector(".hljs.language-json");
      expect(codeElement).toBeInTheDocument();
      expect(codeElement?.textContent).toContain('"testVar"');
    });
  });

  it("should include description when provided", async () => {
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} />);

    await expectPreviewedItem({
      Description: [{ "@language": "fr-FR", "@value": "Test description" }],
    });
  });

  it("should include geographic attribute when isGeographic is true", async () => {
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} isGeographic={true} />);

    await expectPreviewedItem({ IsGeographic: true });
  });

  it("should include TextRepresentation when type is text", async () => {
    mockConvertToDDI3.mockResolvedValue(mockXml);

    const textRepresentation = { $type: "TextRepresentationBaseType" as const, MaxLength: 100 };

    render(
      <DdiPreview {...defaultProps} variableType="text" textRepresentation={textRepresentation} />,
    );

    await expectPreviewedItem({
      VariableRepresentation: expect.objectContaining({
        VariableRole: "Mesure",
        TextRepresentation: textRepresentation,
      }),
    });
  });

  it("should include an empty TextRepresentation when type is text without attributes (#1592)", async () => {
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} variableType="text" textRepresentation={undefined} />);

    await expectPreviewedItem({
      VariableRepresentation: expect.objectContaining({
        VariableRole: "Mesure",
        TextRepresentation: { $type: "TextRepresentationBaseType" },
      }),
    });
  });

  it("should include the MissingValuesReference in the conversion payload (#1566)", async () => {
    mockConvertToDDI3.mockResolvedValue(mockXml);

    render(<DdiPreview {...defaultProps} missingValuesReference={missingValuesReference} />);

    await expectPreviewedItem({
      VariableRepresentation: expect.objectContaining({
        MissingValuesReference: missingValuesReference,
      }),
    });
  });

  it("should include the locally edited MMVR and its sentinel code list (#1566)", async () => {
    mockConvertToDDI3.mockResolvedValue(mockXml);

    const sentinelMmvr = {
      $type: "ManagedMissingValuesRepresentation" as const,
      ID: "mmvr-1",
      Agency: "fr.insee",
      Version: "1",
    };
    const sentinelCodeList = {
      $type: "CodeList" as const,
      URN: "urn:ddi:fr.insee:cl-sent:1",
      Agency: "fr.insee",
      ID: "cl-sent",
      Version: "1",
    } as any;

    render(
      <DdiPreview
        {...defaultProps}
        missingValuesReference={missingValuesReference}
        sentinelMmvr={sentinelMmvr}
        sentinelCodeList={sentinelCodeList}
      />,
    );

    await waitFor(() => {
      expect(mockConvertToDDI3).toHaveBeenCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([sentinelMmvr, sentinelCodeList]),
        }),
      );
    });
  });
});

describe("DdiPreview VersionDate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEmptyGroup();
  });

  it("should preview the stored VersionDate of an existing variable", async () => {
    mockConvertToDDI3.mockResolvedValue("<xml/>");

    render(<DdiPreview {...baseProps} variableVersionDate="2026-01-15T09:30:00+01:00" />);

    await expectPreviewedItem({
      ID: "var-1",
      VersionDate: { DateTime: "2026-01-15T09:30:00+01:00" },
    });
  });

  it("should stamp the current date only for a variable that has never been saved", async () => {
    mockConvertToDDI3.mockResolvedValue("<xml/>");

    render(<DdiPreview {...baseProps} />);

    await waitFor(() => expect(mockConvertToDDI3).toHaveBeenCalled());
    const { VersionDate } = mockConvertToDDI3.mock.calls[0][0].items[0];
    expect(Date.parse(VersionDate.DateTime)).toBeGreaterThan(0);
  });
});

/**
 * Aperçu autoportant : un item seulement *référencé* (liste de codes réutilisée, MMVR réutilisée)
 * n'existe pas dans l'état du formulaire tant qu'on ne l'a pas modifié. L'aperçu le résout donc
 * lui-même, pour montrer les mêmes codes que le panneau de représentation — et que l'export.
 */
describe("DdiPreview items référencés", () => {
  const sentinelContent = envelope({
    CodeList: [
      {
        ID: "cl-sent",
        Agency: "fr.insee",
        Version: "1",
        Label: [{ "@language": "fr-FR", "@value": "Valeurs manquantes" }],
        Code: [
          {
            ID: "code-9",
            CategoryReference: { $type: "Category", ID: "cat-9" },
            Value: { StringValue: "9" },
          },
        ],
      },
    ],
    Category: [{ ID: "cat-9", Label: [{ "@language": "fr-FR", "@value": "Non réponse" }] }],
  });

  const reusedCodeListRepresentation = {
    $type: "CodeRepresentationBaseType",
    CodeListReference: {
      $type: "CodeList",
      URN: "urn:ddi:fr.insee:cl-mut:1",
      Agency: "fr.insee",
      ID: "cl-mut",
      Version: "1",
    },
  } as const;

  /** Attend que la conversion ait reçu un item correspondant à `item`. */
  const expectLastPreviewToContain = (item: Record<string, unknown>) =>
    waitFor(() => {
      expect(lastPreviewedItems()).toContainEqual(expect.objectContaining(item));
    });

  beforeEach(() => {
    vi.clearAllMocks();
    mockConvertToDDI3.mockResolvedValue("<xml/>");
    mockEmptyGroup();
    mockGetGroupMissingValuesRepresentations.mockResolvedValue([
      {
        id: "mmvr-1",
        agency: "fr.insee",
        version: "1",
        label: "Valeurs manquantes",
        codeListId: "cl-sent",
        codeValues: ["9"],
      },
    ]);
    mockGetMutualizedCodesList.mockResolvedValue(sentinelContent);
  });

  it("affiche la MMVR réutilisée et ses codes sentinelles, pas seulement la référence", async () => {
    render(<DdiPreview {...baseProps} missingValuesReference={missingValuesReference} />);

    await expectLastPreviewToContain({ $type: "CodeList", ID: "cl-sent" });
    expect(lastPreviewedItems()).toContainEqual(
      expect.objectContaining({
        $type: "ManagedMissingValuesRepresentation",
        ID: "mmvr-1",
        Agency: "fr.insee",
        Version: "1",
        Label: [{ "@language": "fr-FR", "@value": "Valeurs manquantes" }],
        MissingCodeRepresentation: [
          expect.objectContaining({
            CodeListReference: expect.objectContaining({ ID: "cl-sent" }),
          }),
        ],
      }),
    );
    expect(lastPreviewedItems()).toContainEqual(
      expect.objectContaining({ $type: "Category", ID: "cat-9" }),
    );
  });

  it("ne date pas la MMVR réutilisée : sa VersionDate n'est pas connue du sélecteur", async () => {
    render(<DdiPreview {...baseProps} missingValuesReference={missingValuesReference} />);

    await expectLastPreviewToContain({ $type: "ManagedMissingValuesRepresentation" });
    const mmvr = lastPreviewedItems().find(
      (item: any) => item.$type === "ManagedMissingValuesRepresentation",
    );
    expect(mmvr).not.toHaveProperty("VersionDate");
  });

  it("laisse la MMVR modifiée localement telle quelle, sans la résoudre", async () => {
    const sentinelMmvr = {
      $type: "ManagedMissingValuesRepresentation" as const,
      ID: "mmvr-1",
      Agency: "fr.insee",
      Version: "1",
      Label: [{ "@language": "fr-FR", "@value": "Libellé en cours de saisie" }],
    };

    render(
      <DdiPreview
        {...baseProps}
        missingValuesReference={missingValuesReference}
        sentinelMmvr={sentinelMmvr}
      />,
    );

    await waitFor(() => expect(mockConvertToDDI3).toHaveBeenCalled());
    const mmvrs = lastPreviewedItems().filter(
      (item: any) => item.$type === "ManagedMissingValuesRepresentation",
    );
    expect(mmvrs).toEqual([sentinelMmvr]);
  });

  it("ne déclenche aucune résolution quand la variable ne référence ni liste ni MMVR", async () => {
    render(<DdiPreview {...baseProps} />);

    await waitFor(() => expect(mockConvertToDDI3).toHaveBeenCalled());
    expect(mockGetPhysicalInstanceParents).not.toHaveBeenCalled();
    expect(mockGetMutualizedCodesList).not.toHaveBeenCalled();
  });

  it("affiche les codes d'une liste de codes réutilisée non matérialisée", async () => {
    mockGetMutualizedCodesList.mockResolvedValue(
      envelope({
        CodeList: [
          {
            ID: "cl-mut",
            Agency: "fr.insee",
            Version: "1",
            Code: [
              {
                ID: "code-1",
                CategoryReference: { $type: "Category", ID: "cat-1" },
                Value: { StringValue: "1" },
              },
            ],
          },
        ],
        Category: [{ ID: "cat-1", Label: [{ "@language": "fr-FR", "@value": "Oui" }] }],
      }),
    );

    render(
      <DdiPreview
        {...baseProps}
        variableType="code"
        codeRepresentation={reusedCodeListRepresentation}
      />,
    );

    await expectLastPreviewToContain({ $type: "CodeList", ID: "cl-mut" });
    expect(lastPreviewedItems()).toContainEqual(
      expect.objectContaining({ $type: "Category", ID: "cat-1" }),
    );
  });

  it("ne duplique pas une liste de codes déjà matérialisée dans le formulaire", async () => {
    const codeList = {
      $type: "CodeList" as const,
      ID: "cl-mut",
      Agency: "fr.insee",
      Version: "1",
      Code: [],
    } as any;

    render(
      <DdiPreview
        {...baseProps}
        variableType="code"
        codeRepresentation={reusedCodeListRepresentation}
        codeList={codeList}
      />,
    );

    await waitFor(() => expect(mockConvertToDDI3).toHaveBeenCalled());
    const codeLists = lastPreviewedItems().filter((item: any) => item.$type === "CodeList");
    expect(codeLists).toEqual([codeList]);
  });
});
