import i18next from "i18next";
import { Component } from "react";

import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { CreatorsInput } from "@components/business/creators-input";
import { OrganisationInput } from "@components/business/stamps-input/stamps-input";
import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import LabelRequired from "@components/label-required";
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

export class OperationsSerieEdition extends Component {
  static defaultProps = {
    organisation: [],
    indicators: [],
    series: [],
  };

  constructor(props) {
    super(props);
    this.state = this.setInitialState(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.serie.id !== this.props.serie.id) {
      this.setState(this.setInitialState(nextProps));
    }
  }

  setInitialState = (props) => {
    return {
      serverSideError: "",
      clientSideErrors: {},
      submitting: false,
      saving: false,
      serie: {
        ...defaultSerie,
        ...props.serie,
      },
    };
  };

  onChange = (e) => {
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
    this.setState((state) => ({
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

  onSubmit = () => {
    const clientSideErrors = validate(this.props.extraMandatoryFields)(this.state.serie);
    if (clientSideErrors.errorMessage?.length > 0) {
      this.setState({
        submitting: true,
        clientSideErrors,
      });
    } else {
      this.setState({ saving: true });
      const isCreation = !this.state.serie.id;
      const method = isCreation ? "postSeries" : "putSeries";
      return OperationsApi[method](this.state.serie)
        .then(
          (id = this.state.serie.id) => {
            this.props.goBack(`/operations/series/${id}`, isCreation);
          },
          (err) => {
            this.setState({
              serverSideError: err,
            });
          },
        )
        .finally(() => this.setState({ saving: false }));
    }
  };

  render() {
    if (this.state.saving) return <Saving />;

    const { frequencies, categories, indicators, series, goBack } = this.props;

    const serie = {
      ...this.state.serie,
      seeAlso: (this.state.serie.seeAlso || []).map((link) => link.id),
      contributors: (this.state.serie.contributors || []).map((link) => link.id),
      dataCollectors: (this.state.serie.dataCollectors || []).map((link) => link.id),
      publishers: (this.state.serie.publishers || []).map((publisher) => publisher.id),
      replaces: (this.state.serie.replaces || []).map((link) => link.id),
      replacedBy: (this.state.serie.isReplacedBy || []).map((link) => link.id),
      generate: (this.state.serie.generate || []).map((link) => link.id),
    };

    const familiesOptions = this.props.families.map((s) => {
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

    const serverSideError = this.state.serverSideError;

    const isMandatoryField = (fieldName) => this.props.extraMandatoryFields.includes(fieldName);

    return (
      <div className="container editor-container">
        {isEditing && (
          <PageTitleBlock
            titleLg1={this.props.serie.prefLabelLg1}
            titleLg2={this.props.serie.prefLabelLg2}
          />
        )}
        <ActionToolbar>
          <CancelButton action={() => goBack("/operations/series")} />
          <SaveButton
            action={this.onSubmit}
            disabled={this.state.clientSideErrors.errorMessage?.length > 0}
          />
        </ActionToolbar>
        {this.state.submitting && this.state.clientSideErrors && (
          <GlobalClientSideErrorBloc clientSideErrors={this.state.clientSideErrors.errorMessage} />
        )}
        <ErrorBloc error={[serverSideError]} />
        <form>
          {!isEditing && (
            <Row>
              <div className="form-group col-md-12">
                <LabelRequired>{i18next.t("common.familyTitle")}</LabelRequired>
                <Select
                  placeholder={i18next.t("common.familiesTitle")}
                  value={family.id}
                  options={familiesOptions}
                  onChange={(value) =>
                    this.onChange({
                      target: { value, id: "idFamily" },
                    })
                  }
                />
                <ClientSideError
                  id="family-error"
                  error={this.state.clientSideErrors?.fields?.family}
                ></ClientSideError>
              </div>
            </Row>
          )}
          <Row>
            <div className="form-group col-md-6">
              <LabelRequired htmlFor="prefLabelLg1">
                {i18next.t("common.title", { lng: "fr" })}
              </LabelRequired>
              <TextInput
                id="prefLabelLg1"
                value={serie.prefLabelLg1}
                onChange={this.onChange}
                aria-invalid={!!this.state.clientSideErrors.fields?.prefLabelLg1}
                aria-describedby={
                  this.state.clientSideErrors.fields?.prefLabelLg1 ? "prefLabelLg1-error" : null
                }
              />
              <ClientSideError
                id="prefLabelLg1-error"
                error={this.state.clientSideErrors?.fields?.prefLabelLg1}
              ></ClientSideError>
            </div>
            <div className="form-group col-md-6">
              <LabelRequired htmlFor="prefLabelLg2">
                {i18next.t("common.title", { lng: "en" })}
              </LabelRequired>
              <TextInput
                id="prefLabelLg2"
                value={serie.prefLabelLg2}
                onChange={this.onChange}
                aria-invalid={!!this.state.clientSideErrors.fields?.prefLabelLg2}
                aria-describedby={
                  this.state.clientSideErrors.fields?.prefLabelLg2 ? "prefLabelLg2-error" : null
                }
              />
              <ClientSideError
                id="prefLabelLg2-error"
                error={this.state.clientSideErrors?.fields?.prefLabelLg2}
              ></ClientSideError>
            </div>
          </Row>
          <Row>
            <div className="form-group col-md-6">
              <label htmlFor="altLabelLg1">{i18next.t("app.altLabel", { lng: "fr" })}</label>
              <TextInput id="altLabelLg1" value={serie.altLabelLg1} onChange={this.onChange} />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="altLabel2">{i18next.t("app.altLabel", { lng: "en" })}</label>
              <TextInput id="altLabelLg2" value={serie.altLabelLg2} onChange={this.onChange} />
            </div>
          </Row>
          <Row>
            <div className="form-group col-md-6">
              <label htmlFor="abstractLg1">{i18next.t("common.summary", { lng: "fr" })}</label>
              <EditorMarkdown
                text={serie.abstractLg1}
                handleChange={(value) => this.onChange({ target: { value, id: "abstractLg1" } })}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="abstractLg2">{i18next.t("common.summary", { lng: "en" })}</label>
              <EditorMarkdown
                text={serie.abstractLg2}
                handleChange={(value) => this.onChange({ target: { value, id: "abstractLg2" } })}
              />
            </div>
          </Row>
          <Row>
            <div className="form-group col-md-6">
              <label htmlFor="historyNoteLg1">{i18next.t("common.history", { lng: "fr" })}</label>
              <EditorMarkdown
                text={serie.historyNoteLg1}
                handleChange={(value) => this.onChange({ target: { value, id: "historyNoteLg1" } })}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="historyNoteLg2">{i18next.t("common.history", { lng: "en" })}</label>
              <EditorMarkdown
                text={serie.historyNoteLg2}
                handleChange={(value) => this.onChange({ target: { value, id: "historyNoteLg2" } })}
              />
            </div>
          </Row>
          <Row>
            <div className="form-group col-md-12">
              {isMandatoryField("typeCode") ? (
                <LabelRequired htmlFor="typeCode">
                  {i18next.t("common.operationType", { lng: "fr" })}
                </LabelRequired>
              ) : (
                <label htmlFor="typeCode" className="w-100">
                  {i18next.t("common.operationType", { lng: "fr" })}
                </label>
              )}
              <Select
                placeholder=""
                value={serie.typeCode}
                options={categories?.codes?.map((cat) => {
                  return { value: cat.code, label: cat.labelLg1 };
                })}
                onChange={(value) =>
                  this.onChange({
                    target: { value, id: "typeCode" },
                  })
                }
              />
              <ClientSideError
                id="typeCode-error"
                error={this.state.clientSideErrors?.fields?.typeCode}
              ></ClientSideError>
            </div>
          </Row>
          <Row>
            <div className="form-group col-md-12">
              {isMandatoryField("accrualPeriodicityCode") ? (
                <LabelRequired htmlFor="accrualPeriodicityCode">
                  {i18next.t("common.dataCollectFrequency", { lng: "fr" })}
                </LabelRequired>
              ) : (
                <label htmlFor="accrualPeriodicityCode" className="w-100">
                  {i18next.t("common.dataCollectFrequency", { lng: "fr" })}
                </label>
              )}
              <Select
                placeholder=""
                value={serie.accrualPeriodicityCode}
                options={frequencies?.codes?.map((cat) => {
                  return { value: cat.code, label: cat.labelLg1 };
                })}
                onChange={(value) =>
                  this.onChange({
                    target: { value, id: "accrualPeriodicityCode" },
                  })
                }
              />
              <ClientSideError
                id="accrualPeriodicityCode-error"
                error={this.state.clientSideErrors?.fields?.accrualPeriodicityCode}
              ></ClientSideError>
            </div>
          </Row>
          <Row>
            <div className="form-group col-md-12">
              <PublishersInput
                value={serie.publishers}
                required={false}
                onChange={(value) =>
                  this.onChange({
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
                labelSingle={i18next.t("common.stakeholders", { lng: "fr" })}
                labelMulti={i18next.t("common.stakeholders", { lng: "fr" })}
                value={serie.contributors}
                onChange={(value) =>
                  this.onChange({
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
                labelSingle={i18next.t("common.dataCollector", { lng: "fr" })}
                labelMulti={i18next.t("common.dataCollector", { lng: "fr" })}
                value={serie.dataCollectors}
                onChange={(value) =>
                  this.onChange({
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
                  this.onChange({
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
                error={this.state.clientSideErrors?.fields?.creators}
              ></ClientSideError>
            </div>
          </Row>
          <Row>
            <div className="form-group col-md-12">
              <label htmlFor="replaces" className="w-100">
                {i18next.t("common.replaces", { lng: "fr" })}
                <Select
                  placeholder=""
                  value={serie.replaces}
                  options={seriesOptions}
                  onChange={(value) =>
                    this.onChange({
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
                {i18next.t("common.replacedBy", { lng: "fr" })}
                <Select
                  placeholder=""
                  value={serie.replacedBy}
                  options={seriesOptions}
                  onChange={(value) =>
                    this.onChange({
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
                {i18next.t("common.seeAlso", { lng: "fr" })}
                <Select
                  placeholder=""
                  value={serie.seeAlso}
                  options={seriesAndIndicatorsOptions}
                  onChange={(value) =>
                    this.onChange({
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
  }
}
