import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { CreatorsInput } from "@components/business/creators-input";
import { OrganisationInput } from "@components/business/stamps-input/stamps-input";
import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { Saving } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";
import { EditorMarkdown } from "@components/rich-editor/editor-markdown";
import { Select } from "@components/select-rmes";

import { OperationsApi } from "@sdk/operations-api";

import * as ItemToSelectModel from "@utils/item-to-select-model";

import { CL_FREQ, CL_SOURCE_CATEGORY } from "../../../../../constants/code-lists";
import { PublishersInput } from "../../../../components/PublishersInput";
import { validate } from "../validation";

const defaultSerie = {
  id: "",
  prefLabelLg1: "",
  prefLabelLg2: "",
  altLabelLg1: "",
  altLabelLg2: "",
  abstractLg1: "",
  abstractLg2: "",
  historyNoteLg1: "",
  historyNoteLg2: "",
  accrualPeriodicityList: CL_FREQ,
  typeList: CL_SOURCE_CATEGORY,
};

const setInitialState = (props) => ({
  serverSideError: "",
  clientSideErrors: {},
  submitting: false,
  saving: false,
  serie: {
    ...defaultSerie,
    ...props.serie,
  },
});

export const OperationsSerieEdition = ({ indicators = [], series = [], ...props }) => {
  const { t } = useTranslation();
  const [state, setState] = useState(() => setInitialState(props));
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setState(setInitialState(props));
  }, [props.serie.id]);

  const onChange = (e) => {
    let override = {
      [e.target.id]: e.target.value,
    };
    if (e.target.id === "idFamily") {
      override = {
        family: {
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
      serie: {
        ...state.serie,
        ...override,
      },
    }));
  };

  const onSubmit = () => {
    const clientSideErrors = validate(props.extraMandatoryFields)(state.serie);
    if (clientSideErrors.errorMessage?.length > 0) {
      setState((state) => ({
        ...state,
        submitting: true,
        clientSideErrors,
      }));
    } else {
      setState((state) => ({ ...state, saving: true }));
      const isCreation = !state.serie.id;
      const method = isCreation ? "postSeries" : "putSeries";
      return OperationsApi[method](state.serie)
        .then(
          (id = state.serie.id) => {
            props.goBack(`/operations/series/${id}`, isCreation);
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

  const { frequencies, categories, goBack } = props;

  const serie = {
    ...state.serie,
    seeAlso: (state.serie.seeAlso || []).map((link) => link.id),
    contributors: (state.serie.contributors || []).map((link) => link.id),
    dataCollectors: (state.serie.dataCollectors || []).map((link) => link.id),
    publishers: (state.serie.publishers || []).map((publisher) => publisher.id),
    replaces: (state.serie.replaces || []).map((link) => link.id),
    replacedBy: (state.serie.isReplacedBy || []).map((link) => link.id),
    generate: (state.serie.generate || []).map((link) => link.id),
  };

  const familiesOptions = props.families.map((s) => {
    return { value: s.id, label: s.label };
  });

  const family = serie.family || { id: "" };

  const isEditing = !!serie.id;

  const seriesOptions = ItemToSelectModel.toSelectModel(
    series.filter((s) => s.id !== serie.id),
    "series",
  );

  const indicatorsOptions = ItemToSelectModel.toSelectModel(indicators, "indicator");

  const seriesAndIndicatorsOptions = ItemToSelectModel.mergedItemsToSelectModels(
    indicatorsOptions,
    seriesOptions,
  );

  const serverSideError = state.serverSideError;

  const isMandatoryField = (fieldName) => props.extraMandatoryFields.includes(fieldName);

  return (
    <div className="container editor-container">
      {isEditing && (
        <PageTitleBlock titleLg1={props.serie.prefLabelLg1} titleLg2={props.serie.prefLabelLg2} />
      )}
      <ActionToolbar>
        <CancelButton action={() => goBack("/operations/series")} />
        <SaveButton action={onSubmit} disabled={state.clientSideErrors.errorMessage?.length > 0} />
      </ActionToolbar>
      {state.submitting && state.clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={state.clientSideErrors.errorMessage} />
      )}
      <ErrorBloc error={[serverSideError]} />
      <form>
        {!isEditing && (
          <Row>
            <div className="form-group col-md-12">
              <LabelRequired>{t("common.familyTitle")}</LabelRequired>
              <Select
                placeholder={t("common.familiesTitle")}
                value={family.id}
                options={familiesOptions}
                onChange={(value) =>
                  onChange({
                    target: { value, id: "idFamily" },
                  })
                }
              />
              <ClientSideError
                id="family-error"
                error={state.clientSideErrors?.fields?.family}
              ></ClientSideError>
            </div>
          </Row>
        )}
        <Row>
          <div className="form-group col-md-6">
            <LabelRequired htmlFor="prefLabelLg1">
              {t("common.title", { lng: "fr" })}
            </LabelRequired>
            <TextInput
              id="prefLabelLg1"
              value={serie.prefLabelLg1}
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
          <div className="form-group col-md-6">
            <LabelRequired htmlFor="prefLabelLg2">
              {t("common.title", { lng: "en" })}
            </LabelRequired>
            <TextInput
              id="prefLabelLg2"
              value={serie.prefLabelLg2}
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
        <Row>
          <div className="form-group col-md-6">
            <label htmlFor="altLabelLg1">{t("app.altLabel", { lng: "fr" })}</label>
            <TextInput id="altLabelLg1" value={serie.altLabelLg1} onChange={onChange} />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="altLabel2">{t("app.altLabel", { lng: "en" })}</label>
            <TextInput id="altLabelLg2" value={serie.altLabelLg2} onChange={onChange} />
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-6">
            <label htmlFor="abstractLg1">{t("common.summary", { lng: "fr" })}</label>
            <EditorMarkdown
              text={serie.abstractLg1}
              handleChange={(value) => onChange({ target: { value, id: "abstractLg1" } })}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="abstractLg2">{t("common.summary", { lng: "en" })}</label>
            <EditorMarkdown
              text={serie.abstractLg2}
              handleChange={(value) => onChange({ target: { value, id: "abstractLg2" } })}
            />
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-6">
            <label htmlFor="historyNoteLg1">
              {t("common.history", { lng: "fr" })}
            </label>
            <EditorMarkdown
              text={serie.historyNoteLg1}
              handleChange={(value) => onChange({ target: { value, id: "historyNoteLg1" } })}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="historyNoteLg2">
              {t("common.history", { lng: "en" })}
            </label>
            <EditorMarkdown
              text={serie.historyNoteLg2}
              handleChange={(value) => onChange({ target: { value, id: "historyNoteLg2" } })}
            />
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            {isMandatoryField("typeCode") ? (
              <LabelRequired htmlFor="typeCode">
                {t("common.operationType", { lng: "fr" })}
              </LabelRequired>
            ) : (
              <label htmlFor="typeCode" className="w-100">
                {t("common.operationType", { lng: "fr" })}
              </label>
            )}
            <Select
              placeholder=""
              value={serie.typeCode}
              options={categories?.codes?.map((cat) => {
                return { value: cat.code, label: cat.labelLg1 };
              })}
              onChange={(value) =>
                onChange({
                  target: { value, id: "typeCode" },
                })
              }
            />
            <ClientSideError
              id="typeCode-error"
              error={state.clientSideErrors?.fields?.typeCode}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            {isMandatoryField("accrualPeriodicityCode") ? (
              <LabelRequired htmlFor="accrualPeriodicityCode">
                {t("common.dataCollectFrequency", { lng: "fr" })}
              </LabelRequired>
            ) : (
              <label htmlFor="accrualPeriodicityCode" className="w-100">
                {t("common.dataCollectFrequency", { lng: "fr" })}
              </label>
            )}
            <Select
              placeholder=""
              value={serie.accrualPeriodicityCode}
              options={frequencies?.codes?.map((cat) => {
                return { value: cat.code, label: cat.labelLg1 };
              })}
              onChange={(value) =>
                onChange({
                  target: { value, id: "accrualPeriodicityCode" },
                })
              }
            />
            <ClientSideError
              id="accrualPeriodicityCode-error"
              error={state.clientSideErrors?.fields?.accrualPeriodicityCode}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <PublishersInput
              value={serie.publishers}
              required={false}
              onChange={(value) =>
                onChange({
                  target: {
                    value: (Array.isArray(value) ? value : []).map((v) => ({
                      id: v,
                    })),
                    id: "publishers",
                  },
                })
              }
            />
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <OrganisationInput
              multi
              required={false}
              lang="first"
              labelSingle={t("common.stakeholders", {
                lng: "fr",
              })}
              labelMulti={t("common.stakeholders", {
                lng: "fr",
              })}
              value={serie.contributors}
              onChange={(value) =>
                onChange({
                  target: {
                    value: (Array.isArray(value) ? value : []).map((v) => ({
                      id: v,
                    })),
                    id: "contributors",
                  },
                })
              }
            />
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <OrganisationInput
              multi
              required={false}
              lang="first"
              labelSingle={t("common.dataCollector", {
                lng: "fr",
              })}
              labelMulti={t("common.dataCollector", {
                lng: "fr",
              })}
              value={serie.dataCollectors}
              onChange={(value) =>
                onChange({
                  target: {
                    value: (Array.isArray(value) ? value : []).map((v) => ({
                      id: v,
                    })),
                    id: "dataCollectors",
                  },
                })
              }
            />
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <CreatorsInput
              mode="organisation"
              value={serie.creators}
              onChange={(value) =>
                onChange({
                  target: {
                    value,
                    id: "creators",
                  },
                })
              }
              multi
            />
            <ClientSideError
              id="creators-error"
              error={state.clientSideErrors?.fields?.creators}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <label htmlFor="replaces" className="w-100">
              {t("common.replaces", { lng: "fr" })}
              <Select
                placeholder=""
                value={serie.replaces}
                options={seriesOptions}
                onChange={(value) =>
                  onChange({
                    target: {
                      value: value.map((v) => {
                        return { id: v, type: "series" };
                      }),
                      id: "replaces",
                    },
                  })
                }
                multi
              />
            </label>
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <label htmlFor="replacedBy" className="w-100">
              {t("common.replacedBy", { lng: "fr" })}
              <Select
                placeholder=""
                value={serie.replacedBy}
                options={seriesOptions}
                onChange={(value) =>
                  onChange({
                    target: {
                      value: value.map((v) => {
                        return { id: v, type: "series" };
                      }),
                      id: "isReplacedBy",
                    },
                  })
                }
                multi
              />
            </label>
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <label htmlFor="seeAlso" className="w-100">
              {t("common.seeAlso", { lng: "fr" })}
              <Select
                placeholder=""
                value={serie.seeAlso}
                options={seriesAndIndicatorsOptions}
                onChange={(value) =>
                  onChange({
                    target: {
                      value: value.map((v) => {
                        return {
                          id: v,
                          type: v.startsWith("indicator") ? "indicator" : "series",
                        };
                      }),
                      id: "seeAlso",
                    },
                  })
                }
                multi
              />
            </label>
          </div>
        </Row>
      </form>
    </div>
  );
};
