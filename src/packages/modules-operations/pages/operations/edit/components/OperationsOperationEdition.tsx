import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { Saving } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { Operation } from "@model/Operation";

import { OperationsApi } from "@sdk/operations-api";

import { toFormErrors } from "@utils/api-errors";
import { useInvalidateSeries } from "@utils/hooks/series";

import { validate } from "../validation";
import { Controls } from "./Controls";
import { Series } from "./Series";
import { YearInput } from "./YearInput";

interface OperationsOperationEditionTypes {
  /** Absent en création : la page compare `id` à celui de l'opération chargée. */
  id?: string;
  operation: Partial<Operation>;
  goBack: (url: string, replace?: boolean) => void;
}

/**
 * Champs dont une erreur de validation du back s'affiche à côté de la saisie. Le back nomme la
 * série `series` (absente) ou `series.id` (vide) : les deux vont sous le choix de la série.
 */
const FIELDS_WITH_ERROR_SLOT = ["prefLabelLg1", "prefLabelLg2", "series", "series.id", "year"];

interface ClientSideErrors {
  errorMessage?: string[];
  fields?: Record<string, string>;
}

interface State {
  serverSideError: unknown;
  clientSideErrors: ClientSideErrors;
  saving: boolean;
  submitting: boolean;
  operation: Operation;
}

type ChangeLike = { target: { id: string; value: any } };

const defaultOperation: Partial<Operation> = {
  prefLabelLg1: "",
  prefLabelLg2: "",
  altLabelLg1: "",
  altLabelLg2: "",
  year: undefined,
};

const setInitialState = (props: Readonly<OperationsOperationEditionTypes>): State => ({
  serverSideError: "",
  clientSideErrors: {},
  saving: false,
  submitting: false,
  operation: {
    ...defaultOperation,
    ...props.operation,
  } as Operation,
});

export const OperationsOperationEdition = (props: Readonly<OperationsOperationEditionTypes>) => {
  const { t } = useTranslation();

  const [state, setState] = useState<State>(() => setInitialState(props));

  // La fiche d'une série liste ses opérations.
  const invalidateSeries = useInvalidateSeries();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setState(setInitialState(props));
  }, [props.operation.id]);

  const onChange = (e: ChangeLike) => {
    let override: Record<string, any> = {
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
      ...state,
      serverSideError: "",
      submitting: true,
      clientSideErrors: {
        ...state.clientSideErrors,
        errorMessage: [],
      },
      operation: {
        ...state.operation,
        ...override,
      } as Operation,
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
      // Pas de retour au formulaire après un succès : la navigation de goBack est asynchrone,
      // le formulaire réapparaîtrait le temps qu'elle aboutisse.
      return OperationsApi[method](state.operation).then(
        async (id = state.operation.id) => {
          await invalidateSeries();
          props.goBack(`/operations/operation/${id}`, isCreation);
        },
        (err: unknown) => {
          const { clientSideErrors, serverSideError } = toFormErrors(err, FIELDS_WITH_ERROR_SLOT);
          setState((state) => ({
            ...state,
            saving: false,
            ...(clientSideErrors && { submitting: true, clientSideErrors }),
            serverSideError,
          }));
        },
      );
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
      <Controls
        onSubmit={onSubmit}
        disabled={(state.clientSideErrors.errorMessage?.length ?? 0) > 0}
      />
      {state.submitting && state.clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={state.clientSideErrors.errorMessage} />
      )}
      <ErrorBloc error={serverSideError} />
      <form>
        {!isEditing && (
          <Series
            label={t("common.seriesTitle")}
            value={series.id}
            errorMessage={
              state.clientSideErrors.fields?.series || state.clientSideErrors.fields?.["series.id"]
            }
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
                state.clientSideErrors.fields?.prefLabelLg1 ? "prefLabelLg1-error" : undefined
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
                state.clientSideErrors.fields?.prefLabelLg2 ? "prefLabelLg2-error" : undefined
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
