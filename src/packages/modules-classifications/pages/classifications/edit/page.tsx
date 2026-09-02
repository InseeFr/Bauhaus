import { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";

import { ContributorsInput } from "@components/business/contributors-input/contributors-input";
import { CreatorsInput } from "@components/business/creators-input";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInputBlock, UrlInputBlock } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { Loading, Saving } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";
import { MDEditor } from "@components/rich-editor/react-md-editor";
import { Select } from "@components/select-rmes";

import { useTitle } from "@utils/hooks/useTitle";
import { transformModelToSelectOptions } from "@utils/transformer";

import { useClassification } from "../../../hooks/useClassification";
import { useClassificationSeries } from "../../../hooks/useClassificationSeries";
import { useUpdateClassification } from "../../../hooks/useUpdateClassification";
import { Classification } from "../../../types";
import { ClassificationSelect } from "./components/ClassificationSelect";
import { Menu } from "./menu";
import { reducer, initialState } from "./page.reducer";
import { validate } from "./validation";

export const Component = () => {
  const { t } = useTranslation();

  const { id = "" } = useParams<{ id: string }>();

  const { isLoading, classification, status } = useClassification(id);

  const { series } = useClassificationSeries();

  const [{ clientSideErrors, submitting, value }, dispatch] = useReducer(reducer, initialState);

  useTitle(t("classification.pluralTitle"), classification?.general?.prefLabelLg1);

  const { save, isSavingSuccess, isSaving } = useUpdateClassification(id);

  const seriesOptions = transformModelToSelectOptions(series ?? []);

  useEffect(() => {
    if (status === "success" && classification && !value?.general) {
      dispatch({ type: "SET_VALUE", payload: classification });
    }
  }, [status, classification]);

  if (isLoading) return <Loading />;

  if (isSaving) return <Saving />;

  if (isSavingSuccess) {
    return <Navigate to={"/classifications/classification/" + id} replace />;
  }

  if (!classification || !value?.general) return null;

  const general = value.general;

  const setGeneral = (partial: Partial<Classification>) =>
    dispatch({ type: "SET_GENERAL", payload: partial });

  const clearErrorMessage = () => dispatch({ type: "CLEAR_ERROR_MESSAGE" });

  return (
    <div className="container editor-container">
      <PageTitleBlock
        titleLg1={classification?.general?.prefLabelLg1}
        titleLg2={classification?.general?.prefLabelLg2}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const errors = validate(general);
          if (errors.errorMessage?.length > 0) {
            dispatch({ type: "SET_SUBMITTING" });
            dispatch({ type: "SET_ERRORS", payload: errors });
          } else {
            dispatch({ type: "SET_ERRORS", payload: {} });
            (save as unknown as (payload: { general: Classification; levels: unknown[] }) => void)({
              general: { ...classification.general, ...general },
              levels: classification.levels,
            });
          }
        }}
      >
        <Menu disabled={(clientSideErrors.errorMessage?.length ?? 0) > 0} />
        {submitting && clientSideErrors && (
          <GlobalClientSideErrorBloc clientSideErrors={clientSideErrors.errorMessage} />
        )}
        <Row>
          <div className="col-md-6 form-group">
            <TextInputBlock
              required
              label={t("classification.title", { lng: "fr" })}
              error={clientSideErrors?.fields?.prefLabelLg1}
              value={general.prefLabelLg1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setGeneral({ prefLabelLg1: e.target.value });
                clearErrorMessage();
              }}
            />
          </div>
          <div className="col-md-6 form-group">
            <TextInputBlock
              required
              label={t("classification.title", { lng: "en" })}
              error={clientSideErrors?.fields?.prefLabelLg2}
              value={general.prefLabelLg2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setGeneral({ prefLabelLg2: e.target.value });
                clearErrorMessage();
              }}
            />
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-6">
            <TextInputBlock
              label={t("classification.altLabel", { lng: "fr" })}
              value={general.altLabelLg1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGeneral({ altLabelLg1: e.target.value })
              }
            />
          </div>
          <div className="form-group col-md-6">
            <TextInputBlock
              label={t("classification.altLabel", { lng: "en" })}
              value={general.altLabelLg2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGeneral({ altLabelLg2: e.target.value })
              }
            />
          </div>
        </Row>
        <Row>
          <div className="col-md-6 form-group">
            <label htmlFor="descriptionLg1">{t("classification.summary", { lng: "fr" })}</label>
            <MDEditor
              text={general.descriptionLg1}
              handleChange={(v) => setGeneral({ descriptionLg1: v })}
            />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="descriptionLg2">{t("classification.summary", { lng: "en" })}</label>
            <MDEditor
              text={general.descriptionLg2}
              handleChange={(v) => setGeneral({ descriptionLg2: v })}
            />
          </div>
        </Row>
        <div className="form-group">
          <label>{t("classification.motherSeries", { lng: "fr" })}</label>
          <Select
            value={general.idSeries}
            options={seriesOptions}
            onChange={(v: string) => setGeneral({ idSeries: v })}
          />
        </div>
        <div className="form-group">
          <label>{t("classification.followingClassification", { lng: "fr" })}</label>
          <ClassificationSelect
            excludeId={id}
            value={general.idBefore}
            onChange={(v) => setGeneral({ idBefore: v })}
          />
        </div>
        <div className="form-group">
          <label>{t("classification.previousClassification", { lng: "fr" })}</label>
          <ClassificationSelect
            excludeId={id}
            value={general.idAfter}
            onChange={(v) => setGeneral({ idAfter: v })}
          />
        </div>
        <div className="form-group">
          <label>{t("classification.variant", { lng: "fr" })}</label>
          <ClassificationSelect
            excludeId={id}
            value={general.idVariant}
            onChange={(v) => setGeneral({ idVariant: v })}
          />
        </div>
        <div className="form-group">
          <CreatorsInput
            mode="organisation"
            value={general.creator}
            onChange={(creator) => setGeneral({ creator })}
          />
        </div>
        <div className="form-group">
          <ContributorsInput
            mode="organisation"
            value={general.contributor}
            onChange={(contributor) => setGeneral({ contributor })}
          />
        </div>
        <div className="form-group">
          <label>{t("classification.disseminationStatus", { lng: "fr" })}</label>
          <DisseminationStatusInput
            withLabel={false}
            value={general.disseminationStatus}
            handleChange={(v) => setGeneral({ disseminationStatus: v })}
          />
        </div>
        <div className="form-group">
          <UrlInputBlock
            label={t("classification.additionalMaterial", { lng: "fr" })}
            error={clientSideErrors?.fields?.additionalMaterial}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGeneral({ additionalMaterial: e.target.value })
            }
            value={general.additionalMaterial}
          />
        </div>
        <div className="form-group">
          <UrlInputBlock
            label={t("classification.legalMaterial", { lng: "fr" })}
            error={clientSideErrors?.fields?.legalMaterial}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGeneral({ legalMaterial: e.target.value })
            }
            value={general.legalMaterial}
          />
        </div>
        <div className="form-group">
          <UrlInputBlock
            label={t("classification.homepage", { lng: "fr" })}
            error={clientSideErrors?.fields?.homepage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGeneral({ homepage: e.target.value })
            }
            value={general.homepage}
          />
        </div>
        {(classification.general.scopeNoteUriLg1 || classification.general.scopeNoteUriLg2) && (
          <Row>
            <div className="col-md-6 form-group">
              {classification.general.scopeNoteUriLg1 && (
                <>
                  <LabelRequired htmlFor="scopeNoteLg1">
                    {t("classification.scopeNote", { lng: "fr" })}
                  </LabelRequired>
                  <MDEditor
                    text={general.scopeNoteLg1}
                    handleChange={(v) => setGeneral({ scopeNoteLg1: v })}
                  />
                </>
              )}
            </div>
            <div className="col-md-6 form-group">
              {classification.general.scopeNoteUriLg2 && (
                <>
                  <LabelRequired htmlFor="scopeNoteLg2">
                    {t("classification.scopeNote", { lng: "en" })}
                  </LabelRequired>
                  <MDEditor
                    text={general.scopeNoteLg2}
                    handleChange={(v) => setGeneral({ scopeNoteLg2: v })}
                  />
                </>
              )}
            </div>
          </Row>
        )}
        {(classification.general.changeNoteUriLg1 || classification.general.changeNoteUriLg2) && (
          <Row>
            <div className="col-md-6 form-group">
              {classification.general.changeNoteUriLg1 && (
                <>
                  <LabelRequired htmlFor="changeNoteLg1">
                    {t("classification.changeNote", { lng: "fr" })}
                  </LabelRequired>
                  <MDEditor
                    text={general.changeNoteLg1}
                    handleChange={(v) => setGeneral({ changeNoteLg1: v })}
                  />
                </>
              )}
            </div>
            <div className="col-md-6 form-group">
              {classification.general.changeNoteUriLg2 && (
                <>
                  <LabelRequired htmlFor="changeNoteLg2">
                    {t("classification.changeNote", { lng: "en" })}
                  </LabelRequired>
                  <MDEditor
                    text={general.changeNoteLg2}
                    handleChange={(v) => setGeneral({ changeNoteLg2: v })}
                  />
                </>
              )}
            </div>
          </Row>
        )}
      </form>
    </div>
  );
};
