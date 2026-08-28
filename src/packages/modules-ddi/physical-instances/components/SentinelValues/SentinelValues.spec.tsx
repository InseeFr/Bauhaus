import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useState } from "react";
import { SentinelValues } from "./SentinelValues";
import type { Reference } from "../../types/api";
import { itemsOfType, singleItemOfType } from "../../types/ddi4Items";
import { envelope } from "../../types/ddi4Items.testing";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.sentinel.title": "Valeurs sentinelles",
        "physicalInstance.view.sentinel.createNewList": "Créer",
        "physicalInstance.view.sentinel.remove": "Retirer",
        "physicalInstance.view.sentinel.select": "Sélectionnez des valeurs sentinelles",
        "physicalInstance.view.sentinel.loading": "Chargement des valeurs sentinelles...",
        "physicalInstance.view.sentinel.errorLoading":
          "Erreur lors du chargement des valeurs sentinelles",
        "physicalInstance.view.code.codeListLabel": "Libellé de la liste de codes",
        "physicalInstance.view.code.value": "Valeur",
        "physicalInstance.view.code.label": "Libellé",
        "physicalInstance.view.code.addCode": "Ajouter un code",
        "physicalInstance.view.code.loadingCodes": "Chargement des codes...",
        "physicalInstance.view.code.noCodes": "Aucun code",
        "physicalInstance.view.code.actionsMenu": "Menu des actions",
        "physicalInstance.view.code.moveUp": "Monter",
        "physicalInstance.view.code.moveDown": "Descendre",
        "physicalInstance.view.code.deleteCode": "Supprimer",
        "physicalInstance.view.code.addCodeTooltip": "Ajouter ce code",
        "physicalInstance.view.code.fillFieldsTooltip":
          "Remplissez au moins un champ pour ajouter un code",
        "physicalInstance.view.code.usersPanel.unknownStudyUnit": "Unité d'enquête inconnue",
        "physicalInstance.view.sentinel.usersPanel.title":
          "Utilisations de ces valeurs sentinelles",
        "physicalInstance.view.sentinel.usersPanel.help":
          "Variables qui réutilisent ces valeurs sentinelles",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("../../../../application/app-context", () => ({
  useAppContext: () => ({
    properties: {
      defaultAgencyId: "fr.insee",
    },
  }),
}));

vi.mock("react-router-dom", () => ({
  useParams: () => ({
    id: "pi-1",
    agencyId: "fr.insee",
  }),
}));

vi.mock("../../../hooks/useDefaultLocale", () => ({
  useDefaultLocale: () => "fr-FR",
}));

const mockUseAllMissingValuesRepresentations = vi.fn();
vi.mock("../../../hooks/useAllMissingValuesRepresentations", () => ({
  useAllMissingValuesRepresentations: (agencyId: string, piId: string) =>
    mockUseAllMissingValuesRepresentations(agencyId, piId),
}));

const mockUseMutualizedCodesList = vi.fn();
vi.mock("../../../hooks/useMutualizedCodesList", () => ({
  useMutualizedCodesList: (agencyId: string, id: string) =>
    mockUseMutualizedCodesList(agencyId, id),
}));

const mockUseMmvrUsers = vi.fn();
vi.mock("../../../hooks/useMmvrUsers", () => ({
  useMmvrUsers: (agencyId: string, id: string, enabled?: boolean) =>
    mockUseMmvrUsers(agencyId, id, enabled),
}));

const confirmDialogMock = vi.fn();
vi.mock("primereact/confirmdialog", () => ({
  confirmDialog: (options: any) => confirmDialogMock(options),
  ConfirmDialog: () => null,
}));

const groupMmvrs = [
  {
    id: "mmvr-1",
    agency: "fr.insee",
    version: "1",
    label: "Valeurs sentinelles NSP/REF",
    codeListId: "cl-sentinelles",
    codeValues: ["NSP", "REF"],
  },
];

const sentinelCodeListContent = envelope({
  CodeList: [
    {
      $type: "CodeList",
      ID: "cl-sentinelles",
      Agency: "fr.insee",
      Version: "1",
      Label: [{ "@language": "fr-FR", "@value": "Sentinelles" }],
      Code: [
        {
          $type: "CodeType",
          ID: "c1",
          Value: { StringValue: "NSP" },
          CategoryReference: { $type: "Category", ID: "cat-nsp" },
        },
      ],
    },
  ],
  Category: [
    {
      $type: "Category",
      ID: "cat-nsp",
      Label: [{ "@language": "fr-FR", "@value": "Ne sait pas" }],
    },
  ],
});

const usage = (variableId: string) => ({
  studyUnitAgencyId: "fr.insee",
  studyUnitId: "su-1",
  studyUnitLabel: "Étude",
  physicalInstanceAgencyId: "fr.insee",
  physicalInstanceId: "pi-1",
  physicalInstanceLabel: "Fichier",
  variableAgencyId: "fr.insee",
  variableId,
  variableLabel: variableId,
});

const reference: Reference = {
  $type: "ManagedMissingValuesRepresentation",
  URN: "urn:ddi:fr.insee:mmvr-1:1",
  Agency: "fr.insee",
  ID: "mmvr-1",
  Version: "1",
};

describe("SentinelValues", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAllMissingValuesRepresentations.mockReturnValue({
      data: groupMmvrs,
      groupLabel: "Mon groupe",
      isLoading: false,
      error: undefined,
    });
    mockUseMutualizedCodesList.mockReturnValue({ data: undefined, isLoading: false });
    mockUseMmvrUsers.mockReturnValue({ data: [], isLoading: false });
  });

  it("renders a collapsed accordion with the sentinel section title", () => {
    render(<SentinelValues currentVariableId="var-1" onChange={vi.fn()} />);

    expect(screen.getByText("Valeurs sentinelles")).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("shows the select of every group MMVR and the create action once expanded", () => {
    render(<SentinelValues currentVariableId="var-1" onChange={vi.fn()} />);

    fireEvent.click(screen.getByText("Valeurs sentinelles"));

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Créer")).toBeInTheDocument();
  });

  it("creates a new MMVR and its sentinel code list on the fly", () => {
    const onChange = vi.fn();
    render(<SentinelValues currentVariableId="var-1" onChange={onChange} />);

    fireEvent.click(screen.getByText("Valeurs sentinelles"));
    fireEvent.click(screen.getByText("Créer"));

    expect(onChange).toHaveBeenCalledTimes(1);
    const [reference, mmvr, codeList, categories] = onChange.mock.calls[0];
    // La référence pointe la MMVR nouvellement créée, qui référence sa CodeList.
    expect(reference.$type).toBe("ManagedMissingValuesRepresentation");
    expect(reference.ID).toBe(mmvr.ID);
    expect(mmvr.MissingCodeRepresentation?.[0]?.CodeListReference?.ID).toBe(codeList.ID);
    // Une ligne vide initiale : un code + sa catégorie.
    expect(codeList.Code).toHaveLength(1);
    expect(categories).toHaveLength(1);
  });

  // Câblage réel : le parent renvoie en props les items émis, comme VariableEditForm.
  const ControlledSentinelValues = ({ initialReference }: { initialReference?: Reference }) => {
    const [props, setProps] = useState<any>({ missingValuesReference: initialReference });
    return (
      <SentinelValues
        key="var-1-sentinel"
        currentVariableId="var-1"
        {...props}
        onChange={(missingValuesReference, mmvr, sentinelCodeList, sentinelCategories) =>
          setProps({ missingValuesReference, mmvr, sentinelCodeList, sentinelCategories })
        }
      />
    );
  };

  const lastValueInput = () => {
    const inputs = screen.getAllByLabelText("Valeur");
    return inputs[inputs.length - 1];
  };

  it("laisse saisir plusieurs caractères dans un code ajouté à une nouvelle liste", async () => {
    const user = userEvent.setup();
    render(<ControlledSentinelValues />);

    await user.click(screen.getByText("Valeurs sentinelles"));
    await user.click(screen.getByText("Créer"));
    await user.click(screen.getByText("Ajouter un code"));
    await user.type(lastValueInput(), "NSP");

    expect(lastValueInput()).toHaveValue("NSP");
  });

  it("laisse saisir plusieurs caractères dans un code ajouté à une liste existante", async () => {
    mockUseMutualizedCodesList.mockReturnValue({ data: sentinelCodeListContent, isLoading: false });
    const user = userEvent.setup();
    render(<ControlledSentinelValues initialReference={reference} />);

    await user.click(screen.getByText("Valeurs sentinelles"));
    await user.click(screen.getByText("Ajouter un code"));
    await user.type(lastValueInput(), "REF");

    expect(lastValueInput()).toHaveValue("REF");
  });

  it("emits a reference to the selected MMVR", () => {
    const onChange = vi.fn();
    render(<SentinelValues currentVariableId="var-1" onChange={onChange} />);

    fireEvent.click(screen.getByText("Valeurs sentinelles"));
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText(/Valeurs sentinelles NSP\/REF/));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        $type: "ManagedMissingValuesRepresentation",
        Agency: "fr.insee",
        ID: "mmvr-1",
        Version: "1",
      }),
      undefined,
      undefined,
      undefined,
    );
  });

  it("shows the code list as read-only when at least one OTHER variable uses the MMVR", () => {
    mockUseMutualizedCodesList.mockReturnValue({ isLoading: false, data: sentinelCodeListContent });
    // Utilisée par la variable courante ET une autre : lecture seule.
    mockUseMmvrUsers.mockReturnValue({
      data: [usage("var-1"), usage("var-2")],
      isLoading: false,
    });

    render(
      <SentinelValues
        currentVariableId="var-1"
        missingValuesReference={reference}
        onChange={vi.fn()}
      />,
    );

    expect(mockUseMmvrUsers).toHaveBeenCalledWith("fr.insee", "mmvr-1", true);
    expect(screen.getByDisplayValue("NSP")).toHaveAttribute("readonly");
    expect(screen.queryByText("Ajouter un code")).not.toBeInTheDocument();
  });

  it("keeps the code list editable and materializes edits under the same IDs when only this variable uses the MMVR", () => {
    const onChange = vi.fn();
    mockUseMutualizedCodesList.mockReturnValue({ isLoading: false, data: sentinelCodeListContent });
    mockUseMmvrUsers.mockReturnValue({ data: [usage("var-1")], isLoading: false });

    render(
      <SentinelValues
        currentVariableId="var-1"
        missingValuesReference={reference}
        onChange={onChange}
      />,
    );

    // Seule utilisatrice : table éditable.
    expect(screen.getByDisplayValue("NSP")).not.toHaveAttribute("readonly");
    expect(screen.getByText("Ajouter un code")).toBeInTheDocument();

    // Une édition matérialise la MMVR et sa CodeList sous les MÊMES IDs (pas de fork).
    fireEvent.change(screen.getByDisplayValue("NSP"), { target: { value: "NSP2" } });

    expect(onChange).toHaveBeenCalledTimes(1);
    const [emittedRef, emittedMmvr, emittedCodeList, emittedCategories] = onChange.mock.calls[0];
    expect(emittedRef.ID).toBe("mmvr-1");
    expect(emittedMmvr.ID).toBe("mmvr-1");
    expect(emittedCodeList.ID).toBe("cl-sentinelles");
    expect(emittedCodeList.Code[0].Value.StringValue).toBe("NSP2");
    expect(emittedCategories).toHaveLength(1);
  });

  it("shows the pending local edits as an editable table after save and reopen", () => {
    // Après « Mettre à jour » + re-clic : la variable porte la MMVR matérialisée localement.
    mockUseMmvrUsers.mockReturnValue({ data: [usage("var-1")], isLoading: false });
    render(
      <SentinelValues
        currentVariableId="var-1"
        missingValuesReference={reference}
        mmvr={
          {
            $type: "ManagedMissingValuesRepresentation",
            ID: "mmvr-1",
            Agency: "fr.insee",
            Version: "1",
            Label: [{ "@language": "fr-FR", "@value": "Sentinelles" }],
          } as any
        }
        sentinelCodeList={singleItemOfType(sentinelCodeListContent, "CodeList") as any}
        sentinelCategories={itemsOfType(sentinelCodeListContent, "Category") as any}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue("Sentinelles")).toBeInTheDocument();
    expect(screen.getByDisplayValue("NSP")).not.toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("Ne sait pas")).toBeInTheDocument();
  });

  it("shows the read-only table as soon as the code list is loaded, while usages still load", () => {
    // Chargement progressif : la table s'affiche verrouillée dès que le contenu est là ; elle ne
    // sera déverrouillée que quand les usages auront confirmé « seule utilisatrice ».
    mockUseMutualizedCodesList.mockReturnValue({ isLoading: false, data: sentinelCodeListContent });
    mockUseMmvrUsers.mockReturnValue({ data: [], isLoading: true });

    render(
      <SentinelValues
        currentVariableId="var-1"
        missingValuesReference={reference}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue("NSP")).toBeInTheDocument();
    expect(screen.getByDisplayValue("NSP")).toHaveAttribute("readonly");
    expect(screen.queryByText("Ajouter un code")).not.toBeInTheDocument();
  });

  it("lists the other variables using the MMVR when it is shared", () => {
    mockUseMutualizedCodesList.mockReturnValue({ isLoading: false, data: sentinelCodeListContent });
    mockUseMmvrUsers.mockReturnValue({
      data: [usage("var-1"), usage("var-2")],
      isLoading: false,
    });

    render(
      <SentinelValues
        currentVariableId="var-1"
        missingValuesReference={reference}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Utilisations de ces valeurs sentinelles")).toBeInTheDocument();
  });

  it("does not query the usages while local edits carry the MMVR (création à la volée)", () => {
    // MMVR créée/modifiée localement : elle n'existe pas (ou plus sous cette forme) côté back,
    // interroger ses usages serait un appel perdu.
    render(
      <SentinelValues
        currentVariableId="var-1"
        missingValuesReference={reference}
        mmvr={
          {
            $type: "ManagedMissingValuesRepresentation",
            ID: "mmvr-1",
            Agency: "fr.insee",
            Version: "1",
            Label: [{ "@language": "fr-FR", "@value": "Sentinelles" }],
          } as any
        }
        sentinelCodeList={singleItemOfType(sentinelCodeListContent, "CodeList") as any}
        sentinelCategories={itemsOfType(sentinelCodeListContent, "Category") as any}
        onChange={vi.fn()}
      />,
    );

    expect(mockUseMmvrUsers).toHaveBeenCalledWith("fr.insee", "mmvr-1", false);
  });

  it("locks the code list when another UNSAVED local variable references the same MMVR", () => {
    // Le back ne connaît pas encore la variable B (locale) : le décompte local complète le sien.
    mockUseMutualizedCodesList.mockReturnValue({ isLoading: false, data: sentinelCodeListContent });
    mockUseMmvrUsers.mockReturnValue({ data: [usage("var-1")], isLoading: false });

    render(
      <SentinelValues
        currentVariableId="var-1"
        missingValuesReference={reference}
        locallyUsedMmvrIds={["mmvr-1"]}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue("NSP")).toHaveAttribute("readonly");
    expect(screen.queryByText("Ajouter un code")).not.toBeInTheDocument();
  });

  it("clears everything when removing the sentinel values", () => {
    const onChange = vi.fn();
    render(
      <SentinelValues
        currentVariableId="var-1"
        missingValuesReference={reference}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByText("Retirer"));

    // Pas de modifications locales en cours : aucun garde-fou, retrait immédiat.
    expect(confirmDialogMock).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(undefined, undefined, undefined, undefined);
  });

  it("asks for confirmation before discarding pending local edits (Retirer)", () => {
    const onChange = vi.fn();
    render(
      <SentinelValues
        currentVariableId="var-1"
        missingValuesReference={reference}
        mmvr={
          {
            $type: "ManagedMissingValuesRepresentation",
            ID: "mmvr-1",
            Agency: "fr.insee",
            Version: "1",
            Label: [{ "@language": "fr-FR", "@value": "Sentinelles" }],
          } as any
        }
        sentinelCodeList={singleItemOfType(sentinelCodeListContent, "CodeList") as any}
        sentinelCategories={itemsOfType(sentinelCodeListContent, "Category") as any}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByText("Retirer"));

    // Modifications locales en cours : garde-fou ; rien n'est appliqué avant l'acceptation.
    expect(confirmDialogMock).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();

    // Accepter applique le retrait.
    confirmDialogMock.mock.calls[0][0].accept();
    expect(onChange).toHaveBeenCalledWith(undefined, undefined, undefined, undefined);
  });

  it("asks for confirmation before discarding pending local edits (nouvelle sélection)", () => {
    const onChange = vi.fn();
    mockUseAllMissingValuesRepresentations.mockReturnValue({
      data: [
        ...groupMmvrs,
        {
          id: "mmvr-2",
          agency: "fr.insee",
          version: "1",
          label: "Autres sentinelles",
          codeListId: "cl-2",
          codeValues: ["ND"],
        },
      ],
      groupLabel: "Mon groupe",
      isLoading: false,
      error: undefined,
    });
    render(
      <SentinelValues
        currentVariableId="var-1"
        missingValuesReference={reference}
        mmvr={
          {
            $type: "ManagedMissingValuesRepresentation",
            ID: "mmvr-1",
            Agency: "fr.insee",
            Version: "1",
            Label: [{ "@language": "fr-FR", "@value": "Sentinelles" }],
          } as any
        }
        sentinelCodeList={singleItemOfType(sentinelCodeListContent, "CodeList") as any}
        sentinelCategories={itemsOfType(sentinelCodeListContent, "Category") as any}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("combobox"));
    // Sélection d'une AUTRE MMVR que celle en cours d'édition.
    fireEvent.click(screen.getByText(/Autres sentinelles/));

    expect(confirmDialogMock).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();

    confirmDialogMock.mock.calls[0][0].accept();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ ID: "mmvr-2" }),
      undefined,
      undefined,
      undefined,
    );
  });
});
