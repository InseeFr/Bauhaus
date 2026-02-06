import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInput, UrlInputBlock } from "@components/form/input";
import LabelRequired from "@components/label-required";
import { Row } from "@components/layout";
import { Loading, Saving } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";
import { MDEditor } from "@components/rich-editor/react-md-editor";

import { useTitle } from "@utils/hooks/useTitle";

import { ByteSizeInput } from "./components/byte-size-input";
import { CompressFormatInput } from "./components/compress-format-input";
import { DatasetSelect } from "./components/dataset-select";
import { FormatInput } from "./components/format-input";
import { LanguageSelect } from "./components/language-select";
import { MediaTypeInput } from "./components/media-type-input";
import { validate } from "./validation";
import { Menu } from "./menu";
import { initialState, reducer } from "./reducer";
import { useDistribution } from "../../../hooks/useDistribution";
import { useCreateOrUpdateDistribution } from "../../../hooks/useCreateOrUpdateDistribution";

export const Component = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [state, dispatch] = useReducer(reducer, initialState);

  const updateField = (field: string) => (value: unknown) => {
    dispatch({
      type: "UPDATE_DISTRIBUTION",
      payload: { [field]: value },
    });
    dispatch({ type: "CLEAR_ERROR_MESSAGES" });
  };

  const updateFieldFromEvent = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(field)(e.target.value);
  };

  const { data: distribution, status } = useDistribution(id);

  useEffect(() => {
    if (status === "success") {
      dispatch({ type: "SET_DISTRIBUTION", payload: distribution });
    }
  }, [status, distribution]);

  const { isSaving, save, serverSideError } = useCreateOrUpdateDistribution(isEditing);

  useTitle(t("distribution.title"), state.editingDistribution?.labelLg1);

  if (!distribution && isEditing) {
    return <Loading />;
  }
  if (isSaving) {
    return <Saving />;
  }

  const onSubmit = () => {
    const clientSideErrors = validate(state.editingDistribution);
    if (clientSideErrors.errorMessage?.length > 0) {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      dispatch({ type: "SET_CLIENT_SIDE_ERRORS", payload: clientSideErrors });
    } else {
      dispatch({ type: "SET_CLIENT_SIDE_ERRORS", payload: {} });
      save(state.editingDistribution);
    }
  };

  return (
    <div className="container editor-container">
      {isEditing && (
        <PageTitleBlock titleLg1={distribution.labelLg1} titleLg2={distribution.labelLg2} />
      )}
      <Menu onSave={onSubmit} isSaveDisabled={state.clientSideErrors.errorMessage?.length > 0} />
      {state.submitting && state.clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={state.clientSideErrors.errorMessage} />
      )}
      <ErrorBloc error={serverSideError} />
      <form>
        <Row>
          <DatasetSelect
            disabled={id !== undefined}
            value={state.editingDistribution.idDataset}
            onChange={updateField("idDataset")}
            error={state.clientSideErrors?.fields?.idDataset}
          />
        </Row>
        <Row>
          <div className="col-md-6 form-group">
            <LabelRequired htmlFor="labelLg1">
              {t("distribution.mainTitle", { lng: "fr" })}
            </LabelRequired>
            <TextInput
              id="labelLg1"
              aria-describedby="labelLg1-error"
              value={state.editingDistribution.labelLg1}
              onChange={updateFieldFromEvent("labelLg1")}
            />
            <ClientSideError
              id="labelLg1-error"
              error={state.clientSideErrors?.fields?.labelLg1}
            ></ClientSideError>
          </div>
          <div className="col-md-6 form-group">
            <LabelRequired htmlFor="labelLg2">
              {t("distribution.mainTitle", { lng: "en" })}
            </LabelRequired>
            <TextInput
              id="labelLg2"
              aria-describedby="labelLg2-error"
              value={state.editingDistribution.labelLg2}
              onChange={updateFieldFromEvent("labelLg2")}
            />
            <ClientSideError
              id="labelLg2-error"
              error={state.clientSideErrors?.fields?.labelLg2}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="col-md-6 form-group">
            <label htmlFor="descriptionLg1">{t("distribution.description", { lng: "fr" })}</label>
            <MDEditor
              text={state.editingDistribution.descriptionLg1}
              handleChange={updateField("descriptionLg1")}
            />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="descriptionLg2">{t("distribution.description", { lng: "en" })}</label>
            <MDEditor
              text={state.editingDistribution.descriptionLg2}
              handleChange={updateField("descriptionLg2")}
            />
          </div>
        </Row>
        <Row>
          <LanguageSelect
            disabled={id !== undefined}
            value={state.editingDistribution.language}
            onChange={updateField("language")}
          />
        </Row>
        <Row>
          <FormatInput value={state.editingDistribution.format} onChange={updateField("format")} />
        </Row>
        <Row>
          <MediaTypeInput
            value={state.editingDistribution.mediaType}
            onChange={updateField("mediaType")}
          />
          <CompressFormatInput
            value={state.editingDistribution.compressFormat}
            onChange={updateField("compressFormat")}
          />
        </Row>
        <Row>
          <ByteSizeInput
            value={state.editingDistribution.byteSize}
            onChange={updateField("byteSize")}
          />
        </Row>
        <Row>
          <div className="col-md-12 form-group">
            <UrlInputBlock
              label={t("distribution.accessURL")}
              value={state.editingDistribution.accessUrl}
              onChange={updateFieldFromEvent("accessUrl")}
              error={state.clientSideErrors?.fields?.accessUrl}
            />
          </div>
        </Row>
        <Row>
          <div className="col-md-12 form-group">
            <UrlInputBlock
              label={t("distribution.downloadURL")}
              value={state.editingDistribution.url}
              onChange={updateFieldFromEvent("url")}
              error={state.clientSideErrors?.fields?.url}
            />
          </div>
        </Row>
      </form>
    </div>
  );
};
