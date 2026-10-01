import { ChangeEvent, MouseEvent, useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

import { SeeButton } from "@components/buttons/see";
import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { Select } from "@components/select-rmes";
import { RightSlidingPanel } from "@components/sliding-panel";

import { Code, Codelist } from "@model/Codelist";

import { CodelistsApi } from "@sdk/index";

import {
  CodeChanges,
  EditableCode,
  mergeCodeChanges,
  withCreatedCode,
  withDeletedCode,
  withUpdatedCode,
} from "../utils/code-changes";
import { validateCode } from "../utils/validateCode";
import { CodeSlidingPanelMenu } from "./CodeSlidingPanelMenu";
import { CodesPanelAddButton } from "./CodesPanelAddButton";
import { CollapsiblePanel } from "./CollapsiblePanel";
import "./CodesPanel.css";
import { Table, TableTypes } from "./Table";

type CodeFormState = EditableCode;

interface CodeSlidingPanelTypes {
  code: CodeFormState;
  handleBack: VoidFunction;
  handleSave: (code: CodeFormState, creation: boolean) => void;
  creation: boolean;
  codelist: Codelist;
  /** Codes affichés, pour refuser la création d'un doublon. */
  existingCodes: CodeFormState[];
  /** Tous les codes de la liste, parmi lesquels choisir parents et enfants. */
  linkableCodes: CodeFormState[];
}

const CodeSlidingPanel = ({
  code: initialCode,
  handleBack,
  handleSave,
  creation,
  codelist,
  existingCodes,
  linkableCodes,
}: Readonly<CodeSlidingPanelTypes>) => {
  const { t } = useTranslation();

  const [code, setCode] = useState<CodeFormState>({});

  const [clientSideErrors, setClientSideErrors] = useState<{
    fields?: Record<string, string>;
    errorMessage?: string[];
  }>({});

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setCode({ ...initialCode });
  }, [initialCode]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientSideErrors({
      ...clientSideErrors,
      errorMessage: [],
    });
    setCode({
      ...code,
      [name]: value,
    });
  };

  // Un même code ne peut être à la fois parent et enfant : chaque liste écarte les choix de l'autre.
  const linkOptions = (excluded: string[] = []) =>
    linkableCodes
      .filter((c) => c.code !== code.code && !excluded.includes(c.code!))
      .map((c) => ({ value: c.code!, label: `${c.code} - ${c.labelLg1}` }));

  const handleSubmit = () => {
    const clientSideErrors = validateCode(code, existingCodes, !creation);

    if (clientSideErrors.errorMessage?.length > 0) {
      setSubmitting(true);
      setClientSideErrors(clientSideErrors);
    } else {
      setClientSideErrors({});
      handleSave(code, creation);
    }
  };

  return (
    <>
      <CodeSlidingPanelMenu
        codelist={codelist}
        handleSubmit={handleSubmit}
        handleBack={handleBack}
        creation={creation}
      />
      {submitting && clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={clientSideErrors.errorMessage} />
      )}
      <Row>
        <div className="col-md-12 form-group">
          <LabelRequired htmlFor="code">{t("codes.title")}</LabelRequired>
          <TextInput
            disabled={!creation}
            id="code"
            name="code"
            onChange={handleChange}
            value={code.code || ""}
            aria-invalid={!!clientSideErrors.fields?.code}
            aria-describedby={clientSideErrors.fields?.code ? "code-error" : undefined}
          />
          <ClientSideError id="code-error" error={clientSideErrors?.fields?.code}></ClientSideError>
        </div>
      </Row>
      <Row>
        <div className="col-md-6 form-group">
          <LabelRequired htmlFor="labelLg1">{t("codes.label", { lng: "fr" })}</LabelRequired>
          <TextInput
            id="labelLg1"
            name="labelLg1"
            onChange={handleChange}
            value={code.labelLg1 || ""}
            aria-invalid={!!clientSideErrors.fields?.labelLg1}
            aria-describedby={clientSideErrors.fields?.labelLg1 ? "labelLg1-error" : undefined}
          />
          <ClientSideError
            id="labelLg1-error"
            error={clientSideErrors?.fields?.labelLg1}
          ></ClientSideError>
        </div>
        <div className="col-md-6 form-group">
          <LabelRequired htmlFor="labelLg2">{t("codes.label", { lng: "en" })}</LabelRequired>
          <TextInput
            id="labelLg2"
            name="labelLg2"
            onChange={handleChange}
            value={code.labelLg2 || ""}
            aria-invalid={!!clientSideErrors.fields?.labelLg2}
            aria-describedby={clientSideErrors.fields?.labelLg2 ? "labelLg2-error" : undefined}
          />
          <ClientSideError
            id="labelLg2-error"
            error={clientSideErrors?.fields?.labelLg2}
          ></ClientSideError>
        </div>
      </Row>
      <Row>
        <div className="col-md-6 form-group">
          <label htmlFor="descriptionLg1">{t("codes.description", { lng: "fr" })}</label>
          <textarea
            className="form-control"
            id="descriptionLg1"
            name="descriptionLg1"
            onChange={handleChange}
            value={code.descriptionLg1 || ""}
          />
        </div>
        <div className="col-md-6 form-group">
          <label htmlFor="descriptionLg2">{t("codes.description", { lng: "en" })}</label>
          <textarea
            className="form-control"
            id="descriptionLg2"
            name="descriptionLg2"
            onChange={handleChange}
            value={code.descriptionLg2 || ""}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-6 form-group" id="broader-field">
          <label htmlFor="broader">{t("codes.broader")}</label>
          <Select
            inputId="broader"
            multi
            value={code.broader ?? []}
            options={linkOptions(code.narrower)}
            onChange={(broader: string[]) => setCode({ ...code, broader })}
          />
        </div>
        <div className="col-md-6 form-group" id="narrower-field">
          <label htmlFor="narrower">{t("codes.narrower")}</label>
          <Select
            inputId="narrower"
            multi
            value={code.narrower ?? []}
            options={linkOptions(code.broader)}
            onChange={(narrower: string[]) => setCode({ ...code, narrower })}
          />
        </div>
      </Row>
    </>
  );
};

interface CodesPanelState {
  codes: { items?: Code[]; total?: number };
  searchCode: string;
  searchLabel: string;
  lazyState: { first: number; rows: number; page: number; sortField: null; sortOrder: null };
  loading: boolean;
  openPanel: boolean;
  selectedCode: CodeFormState;
}

type CodesPanelAction =
  | { type: "SET_CODES"; codes: CodesPanelState["codes"] }
  | { type: "SET_SEARCH_CODE"; value: string }
  | { type: "SET_SEARCH_LABEL"; value: string }
  | { type: "SET_LAZY_STATE"; lazyState: CodesPanelState["lazyState"] }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "OPEN_CREATION_PANEL" }
  | { type: "OPEN_EDIT_PANEL"; code: CodeFormState }
  | { type: "CLOSE_PANEL" };

const initialCodesPanelState: CodesPanelState = {
  codes: [] as unknown as CodesPanelState["codes"],
  searchCode: "",
  searchLabel: "",
  lazyState: { first: 0, rows: 10, page: 0, sortField: null, sortOrder: null },
  loading: true,
  openPanel: false,
  selectedCode: {},
};

function codesPanelReducer(state: CodesPanelState, action: CodesPanelAction): CodesPanelState {
  switch (action.type) {
    case "SET_CODES":
      return { ...state, codes: action.codes };
    case "SET_SEARCH_CODE":
      return { ...state, searchCode: action.value };
    case "SET_SEARCH_LABEL":
      return { ...state, searchLabel: action.value };
    case "SET_LAZY_STATE":
      return { ...state, lazyState: action.lazyState };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "OPEN_CREATION_PANEL":
      return { ...state, openPanel: true };
    case "OPEN_EDIT_PANEL":
      return { ...state, selectedCode: action.code, openPanel: true };
    case "CLOSE_PANEL":
      return { ...state, selectedCode: {}, openPanel: false };
    default:
      return state;
  }
}

interface CodesPanelTypes {
  codelist: Codelist;
  hidden?: boolean;
  editable: boolean;
  /** Modifications de codes en attente, envoyées à la sauvegarde de la liste. */
  codeChanges?: CodeChanges;
  onCodeChangesChange?: (changes: CodeChanges) => void;
}

export const CodesPanel = ({
  codelist,
  hidden,
  editable,
  codeChanges = {},
  onCodeChangesChange = () => {},
}: Readonly<CodesPanelTypes>) => {
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(codesPanelReducer, initialCodesPanelState);

  const { codes, searchCode, searchLabel, lazyState, loading, openPanel, selectedCode } = state;

  const [allCodes, setAllCodes] = useState<Code[]>([]);

  // Échec de la dernière lecture des codes : le tableau n'affiche alors plus rien comme résultat.
  const [codesError, setCodesError] = useState<unknown>();

  const showCodes = (request: Promise<any>) =>
    request.then((cl: any) => {
      setCodesError(undefined);
      dispatch({ type: "SET_CODES", codes: cl ?? {} });
    }, setCodesError);

  useEffect(() => {
    if (editable && codelist.id) {
      CodelistsApi.getCodelistCodes(codelist.id, 1, 0).then((cl: any) =>
        setAllCodes(cl?.items ?? []),
      );
    }
  }, [codelist.id, editable]);

  const handleSearch = (type: "code" | "label", valueCode: string, valueLabel: string) => {
    const [handledValue, otherValue, searchActionType, getCodesBySearch]: [
      string,
      string,
      "SET_SEARCH_CODE" | "SET_SEARCH_LABEL",
      (id?: string, value?: string) => Promise<any>,
    ] =
      type === "code"
        ? [valueCode, searchLabel, "SET_SEARCH_CODE", CodelistsApi.getCodesByCode]
        : [valueLabel, searchCode, "SET_SEARCH_LABEL", CodelistsApi.getCodesByLabel];
    dispatch({ type: searchActionType, value: handledValue });
    if (otherValue) {
      showCodes(CodelistsApi.getCodesByCodeAndLabel(codelist.id, valueCode, valueLabel));
    } else {
      showCodes(getCodesBySearch(codelist.id, handledValue));
    }
  };

  const fetchCodes = () => {
    dispatch({ type: "SET_LOADING", loading: true });
    showCodes(
      CodelistsApi.getCodesDetailedCodelist(codelist.id, (lazyState.page ?? 0) + 1),
    ).finally(() => dispatch({ type: "SET_LOADING", loading: false }));
  };

  useEffect(() => {
    fetchCodes();
  }, [codelist.id, lazyState.page]);

  const onHandlePanel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch({ type: "OPEN_CREATION_PANEL" });
  };

  const displayedCodes = mergeCodeChanges(codes.items ?? [], codeChanges);

  const codesWithActions = displayedCodes.map((code) => {
    return {
      ...code,
      broader: code.broader?.length ? code.broader.join(",") : "",
      narrower: code.narrower?.length ? code.narrower.join(",") : "",
      closeMatch: code.closeMatch?.length ? code.closeMatch.join(",") : "",
      actions: (
        <>
          {editable && (
            <SeeButton
              data-component-id={code.code}
              onClick={() => {
                dispatch({ type: "OPEN_EDIT_PANEL", code });
              }}
            ></SeeButton>
          )}
          {editable && (
            <button
              type="button"
              className="btn btn-default"
              data-component-id={code.code}
              onClick={() => onCodeChangesChange(withDeletedCode(codeChanges, code))}
              aria-label={t("codes.removeCode")}
              title={t("codes.removeCode")}
            >
              <span className="glyphicon glyphicon-minus"></span>
            </button>
          )}
        </>
      ),
    };
  });

  return (
    <Row>
      <CollapsiblePanel
        id="code-panel"
        hidden={hidden}
        title={
          <>
            {t("codes.pluralTitle")}
            {editable && <CodesPanelAddButton codelist={codelist} onHandlePanel={onHandlePanel} />}
          </>
        }
        collapsible={false}
      >
        <Row>
          <div className="col-md-6 form-group">
            <label htmlFor="search-code">{t("codes.searchByCode")}</label>
            <TextInput
              id="search-code"
              value={searchCode}
              onChange={(e) => handleSearch("code", e.target.value, searchLabel)}
            />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="search-label">{t("codes.searchByLabel")}</label>
            <TextInput
              id="search-label"
              value={searchLabel}
              onChange={(e) => handleSearch("label", searchCode, e.target.value)}
            />
          </div>
        </Row>
        {codesError ? (
          <ErrorBloc error={codesError} />
        ) : (
          <Table
            codesWithActions={codesWithActions as unknown as TableTypes["codesWithActions"]}
            loading={loading}
            onPage={(newLazyState) =>
              dispatch({
                type: "SET_LAZY_STATE",
                lazyState: newLazyState as unknown as CodesPanelState["lazyState"],
              })
            }
            total={(codes.total ?? 0) + displayedCodes.length - (codes.items?.length ?? 0)}
            state={lazyState}
          />
        )}
      </CollapsiblePanel>
      <RightSlidingPanel isOpen={openPanel} onHide={() => dispatch({ type: "CLOSE_PANEL" })}>
        <div id="code-edit-panel">
          <CodeSlidingPanel
            code={selectedCode}
            codelist={codelist}
            creation={!selectedCode.code}
            existingCodes={displayedCodes}
            linkableCodes={mergeCodeChanges(allCodes, codeChanges)}
            handleBack={() => dispatch({ type: "CLOSE_PANEL" })}
            handleSave={(code, creation) => {
              const withCode = creation ? withCreatedCode : withUpdatedCode;
              onCodeChangesChange(withCode(codeChanges, code));
              dispatch({ type: "CLOSE_PANEL" });
            }}
          ></CodeSlidingPanel>
        </div>
      </RightSlidingPanel>
    </Row>
  );
};
