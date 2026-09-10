import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { CreatorsInput } from "@components/business/creators-input";
import { OrganizationInput } from "@components/business/stamps-input/stamps-input";
import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { InputRmes } from "@components/input-rmes";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { Saving } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";
import { RequiredIcon } from "@components/required-icon";
import { EditorMarkdown } from "@components/rich-editor/editor-markdown";
import { Select } from "@components/select-rmes";

import { Codelist } from "@model/Codelist";
import { Indicator, IndicatorsList } from "@model/operations/indicator";
import { Option } from "@model/SelectOption";
import { Series } from "@model/Series";

import { OperationsApi } from "@sdk/operations-api";

import * as ItemToSelectModel from "@utils/item-to-select-model";

import { CL_FREQ } from "../../../../../constants/code-lists";
import { PublishersInput } from "../../../../components/PublishersInput";
import { validate } from "../validation";
import { Control } from "./Control";

interface OperationsIndicatorEditionTypes {
  indicator: Indicator;
  indicators: IndicatorsList;
  series: Series[];
  frequencies: Codelist;
  goBack: (url: string, replace?: boolean) => void;
}

interface ClientSideErrors {
  errorMessage?: string[];
  fields?: Record<string, string>;
}

interface State {
  serverSideError: string;
  clientSideErrors: ClientSideErrors;
  submitting: boolean;
  saving: boolean;
  indicator: Indicator;
}

const defaultIndicator: Partial<Indicator> = {
  prefLabelLg1: "",
  prefLabelLg2: "",
  altLabelLg1: "",
  altLabelLg2: "",
  abstractLg1: "",
  abstractLg2: "",
  historyNoteLg1: "",
  historyNoteLg2: "",
  accrualPeriodicityList: CL_FREQ,
  wasGeneratedBy: [],
};

const setInitialState = (props: Readonly<OperationsIndicatorEditionTypes>): State => ({
  serverSideError: "",
  clientSideErrors: {},
  submitting: false,
  saving: false,
  indicator: {
    ...defaultIndicator,
    ...props.indicator,
  } as Indicator,
});

const ONCHANGE_FIELDS: (keyof Indicator)[] = [
  "prefLabelLg1",
  "prefLabelLg2",
  "altLabelLg1",
  "altLabelLg2",
  "abstractLg1",
  "abstractLg2",
  "historyNoteLg1",
  "historyNoteLg2",
  "accrualPeriodicityCode",
];

export const OperationsIndicatorEdition = (props: Readonly<OperationsIndicatorEditionTypes>) => {
  const { t } = useTranslation();

  const [state, setState] = useState<State>(() => setInitialState(props));

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setState(setInitialState(props));
  }, [props.indicator.id]);

  const onChange = useCallback(
    (selector: keyof Indicator) => (value: any) => {
      setState((state) => ({
        ...state,
        serverSideError: "",
        submitting: true,
        clientSideErrors: {
          ...state.clientSideErrors,
          errorMessage: [],
        },
        indicator: {
          ...state.indicator,
          [selector]: value,
        } as Indicator,
      }));
    },
    [],
  );

  const onChanges = useMemo(
    () =>
      ONCHANGE_FIELDS.reduce<Record<string, (value: any) => void>>(
        (acc, selector) => ({
          ...acc,
          [selector]: onChange(selector),
        }),
        {},
      ),
    [onChange],
  );

  const onSubmit = () => {
    const clientSideErrors = validate(state.indicator);
    if (clientSideErrors.errorMessage?.length > 0) {
      setState((state) => ({
        ...state,
        submitting: true,
        clientSideErrors,
      }));
    } else {
      setState((state) => ({ ...state, saving: true }));
      const isCreation = !state.indicator.id;
      const method = isCreation ? "createIndicator" : "updateIndicator";
      return OperationsApi[method](state.indicator)
        .then(
          (id = state.indicator.id) => {
            props.goBack(`/operations/indicator/${id}`, isCreation);
          },
          (err: string) => {
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

  const { frequencies, indicators, series } = props;

  const isUpdate = !!state.indicator.id;

  const indicator = {
    ...state.indicator,
    seeAlso: (state.indicator.seeAlso || []).map((link) => link.id),
    wasGeneratedBy: (state.indicator.wasGeneratedBy || []).map((link) => link.id),
    replaces: (state.indicator.replaces || []).map((link) => link.id),
    replacedBy: (state.indicator.isReplacedBy || []).map((link) => link.id),
  };

  const seriesOptions = ItemToSelectModel.toSelectModel(series, "series");

  const indicatorsOptions = ItemToSelectModel.toSelectModel(
    indicators.filter((s) => s.id !== indicator.id),
    "indicator",
  );

  // `toSelectModel`/`mergedItemsToSelectModels` type their `type` field as
  // `string | undefined` since the parameter is optional, even though it is
  // always given a literal here; the actual runtime shape does satisfy `Option`.
  const seriesAndIndicatorsOptions = ItemToSelectModel.mergedItemsToSelectModels(
    indicatorsOptions as { type: string; label: string }[],
    seriesOptions as { type: string; label: string }[],
  ) as unknown as Option[];

  return (
    <div className="container editor-container">
      {isUpdate && (
        <PageTitleBlock titleLg1={indicator.prefLabelLg1} titleLg2={indicator.prefLabelLg2} />
      )}
      <Control
        onSubmit={onSubmit}
        disabled={(state.clientSideErrors.errorMessage?.length ?? 0) > 0}
      />
      {state.submitting && state.clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={state.clientSideErrors.errorMessage} />
      )}
      {state.serverSideError && <ErrorBloc error={state.serverSideError} />}
      <form>
        <h4 className="text-center">
          ( <RequiredIcon /> : {t("app.requiredFields", { lng: "fr" })})
        </h4>
        <Row>
          <InputRmes
            colMd={6}
            value={indicator.prefLabelLg1}
            label={t("common.title", { lng: "fr" })}
            star
            handleChange={onChanges.prefLabelLg1}
            arias={{
              "aria-invalid": !!state.clientSideErrors.fields?.prefLabelLg1,
              "aria-describedby": state.clientSideErrors.fields?.prefLabelLg1
                ? "prefLabelLg1-error"
                : null,
            }}
            className="w-100"
            errorBlock={
              <ClientSideError
                id="prefLabelLg1-error"
                error={state.clientSideErrors?.fields?.prefLabelLg1}
              ></ClientSideError>
            }
          />
          <InputRmes
            colMd={6}
            value={indicator.prefLabelLg2 ?? ""}
            label={t("common.title", { lng: "en" })}
            star
            handleChange={onChanges.prefLabelLg2}
            arias={{
              "aria-invalid": !!state.clientSideErrors.fields?.prefLabelLg2,
              "aria-describedby": state.clientSideErrors.fields?.prefLabelLg2
                ? "prefLabelLg2-error"
                : null,
            }}
            className="w-100"
            errorBlock={
              <ClientSideError
                id="prefLabelLg2-error"
                error={state.clientSideErrors?.fields?.prefLabelLg2}
              ></ClientSideError>
            }
          />
        </Row>
        <Row>
          <InputRmes
            colMd={6}
            value={indicator.altLabelLg1 ?? ""}
            label={t("app.altLabel", { lng: "fr" })}
            handleChange={onChanges.altLabelLg1}
            className="w-100"
          />
          <InputRmes
            colMd={6}
            value={indicator.altLabelLg2 ?? ""}
            label={t("app.altLabel", { lng: "en" })}
            handleChange={onChanges.altLabelLg2}
            className="w-100"
          />
        </Row>
        <Row>
          <div className="form-group col-md-6">
            <label htmlFor="abstractLg1">{t("common.summary", { lng: "fr" })}</label>
            <EditorMarkdown
              text={indicator.abstractLg1 ?? ""}
              handleChange={onChanges.abstractLg1}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="abstractLg2">{t("common.summary", { lng: "en" })}</label>
            <EditorMarkdown
              text={indicator.abstractLg2 ?? ""}
              handleChange={onChanges.abstractLg2}
            />
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-6">
            <label htmlFor="historyNoteLg1">{t("common.history", { lng: "fr" })}</label>
            <EditorMarkdown
              text={indicator.historyNoteLg1 ?? ""}
              handleChange={onChanges.historyNoteLg1}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="historyNoteLg2">{t("common.history", { lng: "en" })}</label>
            <EditorMarkdown
              text={indicator.historyNoteLg2 ?? ""}
              handleChange={onChanges.historyNoteLg2}
            />
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <label htmlFor="accrualPeriodicity" className="w-100">
              {t("common.indicatorDataCollectFrequency", {
                lng: "fr",
              })}
              <Select
                placeholder=""
                value={indicator.accrualPeriodicityCode}
                options={frequencies?.codes?.map((cat) => {
                  return { value: cat.code, label: cat.labelLg1 };
                })}
                onChange={onChange("accrualPeriodicityCode")}
              />
            </label>
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <PublishersInput
              value={indicator.publishers}
              onChange={onChange("publishers")}
              required={false}
            />
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <CreatorsInput
              mode="organization"
              value={indicator.creators}
              onChange={onChange("creators")}
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
            <OrganizationInput
              multi
              required={false}
              lang="first"
              labelSingle={t("common.stakeholders", { lng: "fr" })}
              labelMulti={t("common.stakeholders", { lng: "fr" })}
              value={indicator.contributors}
              onChange={onChange("contributors")}
            />
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <label className="w-100">
              {t("common.replaces", { lng: "fr" })}
              <Select
                value={indicator.replaces}
                options={indicatorsOptions}
                placeholder=""
                onChange={(value: any) =>
                  onChange("replaces")(
                    value.map((v: string) => {
                      return {
                        id: v,
                        type: "indicator",
                      };
                    }),
                  )
                }
                multi
              />
            </label>
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <label className="w-100">
              {t("common.replacedByMasc", { lng: "fr" })}
              <Select
                value={indicator.replacedBy}
                options={indicatorsOptions}
                placeholder=""
                onChange={(value: any) =>
                  onChange("isReplacedBy")(
                    value.map((v: string) => {
                      return {
                        id: v,
                        type: "indicator",
                      };
                    }),
                  )
                }
                multi
              />
            </label>
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <LabelRequired className="w-100">
              {t("common.generatedBy", { lng: "fr" })}
            </LabelRequired>
            <Select
              value={indicator.wasGeneratedBy}
              options={seriesOptions}
              multi
              placeholder=""
              onChange={(value: any) =>
                onChange("wasGeneratedBy")(
                  value.map((v: string) => {
                    return {
                      id: v,
                      type: "series",
                    };
                  }),
                )
              }
            />
            <ClientSideError
              id="generated-by-error"
              error={state.clientSideErrors?.fields?.wasGeneratedBy}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-12">
            <label htmlFor="seeAlso" className="w-100">
              {t("common.seeAlso", { lng: "fr" })}
              <Select
                value={indicator.seeAlso}
                options={seriesAndIndicatorsOptions}
                placeholder=""
                onChange={(value: any) =>
                  onChange("seeAlso")(
                    value.map((v: string) => {
                      return {
                        id: v,
                        type: value.startsWith("indicator") ? "indicator" : "series",
                      };
                    }),
                  )
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
