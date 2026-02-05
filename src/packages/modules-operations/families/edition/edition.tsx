import { useReducer, useCallback } from "react";

import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import LabelRequired from "@components/label-required";
import { Row } from "@components/layout";
import { Saving } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";
import { EditorMarkdown } from "@components/rich-editor/editor-markdown";

import { OperationsApi } from "@sdk/operations-api";

import { D1, D2 } from "../../../deprecated-locales";
import D from "../../../deprecated-locales/build-dictionary";
import { Family } from "../../../model/operations/family";
import { validate } from "./validation";

const defaultFamily: Partial<Family> = {
  prefLabelLg1: "",
  prefLabelLg2: "",
  abstractLg1: "",
  abstractLg2: "",
};

interface OperationsFamilyEditionProps {
  id: string;
  family: Family;
  goBack: (url: string, replace?: boolean) => void;
}

interface State {
  family: Family;
  clientSideErrors: {
    errorMessage: string[];
    fields?: Record<string, string>;
  };
  serverSideError: string;
  submitting: boolean;
  saving: boolean;
}

type Action =
  | { type: "RESET_STATE"; payload: Family }
  | { type: "UPDATE_FIELD"; payload: { field: string; value: string } }
  | { type: "SET_CLIENT_ERRORS"; payload: State["clientSideErrors"] }
  | { type: "SET_SERVER_ERROR"; payload: string }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_SUBMITTING"; payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "RESET_STATE":
      return {
        family: {
          ...defaultFamily,
          ...action.payload,
        } as Family,
        clientSideErrors: {
          errorMessage: [],
        },
        serverSideError: "",
        submitting: false,
        saving: false,
      };
    case "UPDATE_FIELD":
      return {
        ...state,
        serverSideError: "",
        submitting: true,
        clientSideErrors: {
          ...state.clientSideErrors,
          errorMessage: [],
        },
        family: {
          ...state.family,
          [action.payload.field]: action.payload.value,
        },
      };
    case "SET_CLIENT_ERRORS":
      return {
        ...state,
        clientSideErrors: action.payload,
      };
    case "SET_SERVER_ERROR":
      return {
        ...state,
        serverSideError: action.payload,
      };
    case "SET_SAVING":
      return {
        ...state,
        saving: action.payload,
      };
    case "SET_SUBMITTING":
      return {
        ...state,
        submitting: action.payload,
      };
    default:
      return state;
  }
};

const OperationsFamilyEdition = ({
  id,
  family: initialFamily,
  goBack,
}: Readonly<OperationsFamilyEditionProps>) => {
  const [state, dispatch] = useReducer(reducer, {
    family: {
      ...defaultFamily,
      ...initialFamily,
    } as Family,
    clientSideErrors: {
      errorMessage: [],
    },
    serverSideError: "",
    submitting: false,
    saving: false,
  });

  if (id !== state.family.id) {
    dispatch({ type: "RESET_STATE", payload: initialFamily });
  }

  const onChange = useCallback(
    (target: string) => (value: string) => {
      dispatch({
        type: "UPDATE_FIELD",
        payload: { field: target, value },
      });
    },
    [],
  );

  const onSubmit = useCallback(() => {
    const errors = validate(state.family);
    if (errors.errorMessage?.length > 0) {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      dispatch({ type: "SET_CLIENT_ERRORS", payload: errors });
    } else {
      dispatch({ type: "SET_SAVING", payload: true });
      const isCreation = !state.family.id;

      const method = isCreation ? "createFamily" : "updateFamily";
      return OperationsApi[method](state.family)
        .then(
          (id = state.family.id) => {
            goBack(`/operations/family/${id}`, isCreation);
          },
          (err: string) => {
            dispatch({ type: "SET_SERVER_ERROR", payload: err });
          },
        )
        .finally(() => dispatch({ type: "SET_SAVING", payload: false }));
    }
  }, [state.family, goBack]);

  if (state.saving) return <Saving />;

  const isEditing = !!state.family.id;

  return (
    <div className="container editor-container">
      {isEditing && (
        <PageTitleBlock
          titleLg1={initialFamily.prefLabelLg1}
          titleLg2={initialFamily.prefLabelLg2}
        />
      )}

      <ActionToolbar>
        <CancelButton action={() => goBack("/operations/families")} />
        <SaveButton action={onSubmit} disabled={state.clientSideErrors.errorMessage.length > 0} />
      </ActionToolbar>

      {state.submitting && state.clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={state.clientSideErrors.errorMessage} />
      )}
      <ErrorBloc error={[state.serverSideError]} D={D} />

      <form>
        <Row>
          <div className="col-md-6 form-group">
            <LabelRequired htmlFor="prefLabelLg1">{D1.title}</LabelRequired>
            <TextInput
              id="prefLabelLg1"
              value={state.family.prefLabelLg1}
              onChange={(e) => onChange(e.target.id)(e.target.value)}
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
          <div className="col-md-6 form-group">
            <LabelRequired htmlFor="prefLabelLg2">{D2.title}</LabelRequired>
            <TextInput
              id="prefLabelLg2"
              value={state.family.prefLabelLg2}
              onChange={(e) => onChange(e.target.id)(e.target.value)}
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
        <Row>
          <div className="col-md-6 form-group">
            <label htmlFor="abstractLg1">{D1.summary}</label>
            <EditorMarkdown
              text={state.family.abstractLg1}
              handleChange={onChange("abstractLg1")}
            />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="abstractLg2">{D2.summary}</label>
            <EditorMarkdown
              text={state.family.abstractLg2}
              handleChange={onChange("abstractLg2")}
            />
          </div>
        </Row>
      </form>
    </div>
  );
};

export default OperationsFamilyEdition;
