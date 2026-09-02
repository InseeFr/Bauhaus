import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { Saving } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { OperationsApi } from "@sdk/operations-api";

import { validate } from "../validation";
import { Controls } from "./Controls";
import { Series } from "./Series";
import { YearInput } from "./YearInput";

const defaultOperation = {
  prefLabelLg1: "",
  prefLabelLg2: "",
  altLabelLg1: "",
  altLabelLg2: "",
  year: undefined,
};

const setInitialState = (props) => ({
  serverSideError: "",
  clientSideErrors: {},
  saving: false,
  submitting: false,
  operation: {
    ...defaultOperation,
    ...props.operation,
  },
});

export const OperationsOperationEdition = (props) => {
  const { t } = useTranslation();

  const [state, setState] = useState(() => setInitialState(props));

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setState(setInitialState(props));
  }, [props.operation.id]);

  const onChange = (e) => {
    let override = {
      [e.target.id]: e.target.value,
    };
    if (e.target.id === "idSeries") {
      override = {
        series: {
          id: e.target.value,
        },
      };
    }
    setState((state) => ({
      serverSideError: "",
      submitting: true,
      clientSideErrors: {
        ...state.clientSideErrors,
        errorMessage: [],
      },
      operation: {
        ...state.operation,
        ...override,
      },
    }));
  };

  const onSubmit = () => {
    const clientSideErrors = validate(state.operation);
    if (clientSideErrors.errorMessage?.length > 0) {
      setState((state) => ({
        ...state,
        submitting: true,
        clientSideErrors,
      }));
    } else {
      setState((state) => ({ ...state, saving: true }));
      const isCreation = !state.operation.id;
      const method = isCreation ? "postOperation" : "putOperation";
      return OperationsApi[method](state.operation)
        .then(
          (id = state.operation.id) => {
            props.goBack(`/operations/operation/${id}`, isCreation);
          },
          (err) => {
            setState((state) => ({
              ...state,
              serverSideError: err,
            }));
          },
        )
        .finally(() => setState((state) => ({ ...state, saving: false })));
    }
  };

  if (state.saving) return <Saving />;

  const { operation, serverSideError } = state;

  const series = operation.series || { id: "" };

  const isEditing = !!operation.id;

  return (
    <div className="container editor-container">
      {isEditing && (
        <PageTitleBlock
          titleLg1={props.operation.prefLabelLg1}
          titleLg2={props.operation.prefLabelLg2}
        />
      )}
      <Controls onSubmit={onSubmit} disabled={state.clientSideErrors.errorMessage?.length > 0} />
      {state.submitting && state.clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={state.clientSideErrors.errorMessage} />
      )}
      <ErrorBloc error={serverSideError} />
      <form>
        {!isEditing && (
          <Series
            label={t("common.seriesTitle")}
            value={series.id}
            onChange={(value) =>
              onChange({
                target: { value, id: "idSeries" },
              })
            }
          ></Series>
        )}
        <Row className="bauhaus-row">
          <div className="form-group">
            <LabelRequired htmlFor="prefLabelLg1">{t("common.title", { lng: "fr" })}</LabelRequired>
            <TextInput
              id="prefLabelLg1"
              value={operation.prefLabelLg1}
              onChange={onChange}
              aria-invalid={!!state.clientSideErrors.fields?.prefLabelLg1}
              aria-describedby={
                state.clientSideErrors.fields?.prefLabelLg1 ? "prefLabelLg1-error" : null
              }
            />
            <ClientSideError
              id="prefLabelLg1-error"
              error={state.clientSideErrors?.fields?.prefLabelLg1}
            ></ClientSideError>
          </div>
          <div className="form-group">
            <LabelRequired htmlFor="prefLabelLg2">{t("common.title", { lng: "en" })}</LabelRequired>
            <TextInput
              id="prefLabelLg2"
              value={operation.prefLabelLg2}
              onChange={onChange}
              aria-invalid={!!state.clientSideErrors.fields?.prefLabelLg2}
              aria-describedby={
                state.clientSideErrors.fields?.prefLabelLg2 ? "prefLabelLg2-error" : null
              }
            />
            <ClientSideError
              id="prefLabelLg2-error"
              error={state.clientSideErrors?.fields?.prefLabelLg2}
            ></ClientSideError>
          </div>
        </Row>
        <Row className="bauhaus-row">
          <div className="form-group">
            <label htmlFor="altLabelLg1">{t("app.altLabel", { lng: "fr" })}</label>
            <TextInput id="altLabelLg1" value={operation.altLabelLg1} onChange={onChange} />
          </div>
          <div className="form-group">
            <label htmlFor="altLabelLg2">{t("app.altLabel", { lng: "en" })}</label>
            <TextInput id="altLabelLg2" value={operation.altLabelLg2} onChange={onChange} />
          </div>
        </Row>
        <YearInput
          value={operation.year}
          onChange={(value) => {
            onChange({
              target: { value, id: "year" },
            });
          }}
          error={state.clientSideErrors?.fields?.year}
        />
      </form>
    </div>
  );
};
