import { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";

import { SeeButton } from "@components/buttons/see";
import { ClientSideError, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { RightSlidingPanel } from "@components/sliding-panel";

import { CodelistsApi } from "@sdk/index";
import { validateCode } from "../utils/validateCode";
import { CollapsiblePanel } from "./CollapsiblePanel";
import { CodeSlidingPanelMenu } from "./CodeSlidingPanelMenu";
import { CodesPanelAddButton } from "./CodesPanelAddButton";
import "./CodesPanel.css";
import { Table } from "./Table";

const CodeSlidingPanel = ({ code: initialCode, handleBack, handleSave, creation, codelist }) => {
  const { t } = useTranslation();

  const [code, setCode] = useState({});

  const [clientSideErrors, setClientSideErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setCode({ ...initialCode });
  }, [initialCode]);

  const handleChange = (e) => {
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

  const handleSubmit = () => {
    const clientSideErrors = validateCode(code, [], !creation);

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
            aria-describedby={clientSideErrors.fields?.code ? "code-error" : null}
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
            aria-describedby={clientSideErrors.fields?.labelLg1 ? "labelLg1-error" : null}
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
            aria-describedby={clientSideErrors.fields?.labelLg2 ? "labelLg2-error" : null}
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
          <TextInput
            id="descriptionLg1"
            name="descriptionLg1"
            onChange={handleChange}
            value={code.descriptionLg1 || ""}
          />
        </div>
        <div className="col-md-6 form-group">
          <label htmlFor="descriptionLg2">{t("codes.description", { lng: "en" })}</label>
          <TextInput
            id="descriptionLg2"
            name="descriptionLg2"
            onChange={handleChange}
            value={code.descriptionLg2 || ""}
          />
        </div>
      </Row>
    </>
  );
};

const initialCodesPanelState = {
  codes: [],
  searchCode: "",
  searchLabel: "",
  lazyState: { first: 0, rows: 10, page: 0, sortField: null, sortOrder: null },
  loading: true,
  openPanel: false,
  selectedCode: {},
};

function codesPanelReducer(state, action) {
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

export const CodesPanel = ({ codelist, hidden, editable }) => {
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(codesPanelReducer, initialCodesPanelState);

  const { codes, searchCode, searchLabel, lazyState, loading, openPanel, selectedCode } = state;

  const handleSearch = (type, valueCode, valueLabel) => {
    const [handledValue, otherValue, searchActionType, getCodesBySearch] =
      type === "code"
        ? [valueCode, searchLabel, "SET_SEARCH_CODE", CodelistsApi.getCodesByCode]
        : [valueLabel, searchCode, "SET_SEARCH_LABEL", CodelistsApi.getCodesByLabel];
    dispatch({ type: searchActionType, value: handledValue });
    if (otherValue) {
      CodelistsApi.getCodesByCodeAndLabel(codelist.id, valueCode, valueLabel).then((cl) => {
        dispatch({ type: "SET_CODES", codes: cl ?? {} });
      });
    } else {
      getCodesBySearch(codelist.id, handledValue).then((cl) => {
        dispatch({ type: "SET_CODES", codes: cl ?? {} });
      });
    }
  };

  const fetchCodes = () => {
    dispatch({ type: "SET_LOADING", loading: true });
    CodelistsApi.getCodesDetailedCodelist(codelist.id, (lazyState.page ?? 0) + 1)
      .then((cl) => {
        dispatch({ type: "SET_CODES", codes: cl ?? {} });
      })
      .finally(() => dispatch({ type: "SET_LOADING", loading: false }));
  };

  useEffect(() => {
    fetchCodes();
  }, [codelist.id, lazyState.page]);

  const onHandlePanel = (e) => {
    e.stopPropagation();
    dispatch({ type: "OPEN_CREATION_PANEL" });
  };

  const codesWithActions = (codes.items ?? []).map((code) => {
    return {
      ...code,
      broader: code.broader?.length > 0 ? code.broader.join(",") : "",
      narrower: code.narrower?.length > 0 ? code.narrower.join(",") : "",
      closeMatch: code.closeMatch?.length > 0 ? code.closeMatch.join(",") : "",
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
              onClick={() => {
                CodelistsApi.deleteCodesDetailedCodelist(codelist.id, code).then(() =>
                  fetchCodes(),
                );
              }}
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
        <Table
          codesWithActions={codesWithActions}
          loading={loading}
          onPage={(newLazyState) => dispatch({ type: "SET_LAZY_STATE", lazyState: newLazyState })}
          total={codes.total}
          state={lazyState}
        />
      </CollapsiblePanel>
      <RightSlidingPanel isOpen={openPanel} onHide={() => dispatch({ type: "CLOSE_PANEL" })}>
        <div id="code-edit-panel">
          <CodeSlidingPanel
            code={selectedCode}
            codelist={codelist}
            creation={!selectedCode.code}
            handleBack={() => dispatch({ type: "CLOSE_PANEL" })}
            handleSave={(code, creation) => {
              let promise;
              if (creation) {
                promise = CodelistsApi.postCodesDetailedCodelist;
              } else {
                promise = CodelistsApi.putCodesDetailedCodelist;
              }
              promise(codelist.id, code)
                .then(() => fetchCodes())
                .then(() => {
                  dispatch({ type: "CLOSE_PANEL" });
                });
            }}
          ></CodeSlidingPanel>
        </div>
      </RightSlidingPanel>
    </Row>
  );
};
