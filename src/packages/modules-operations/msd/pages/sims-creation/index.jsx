import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useBlocker } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "../../../i18n";

import { ActionToolbar } from "@components/action-toolbar";
import { Button } from "@components/buttons/button";
import { CloseIconButton } from "@components/buttons/buttons-with-icons";
import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc } from "@components/errors-bloc";
import { Loading, Saving } from "@components/loading";
import { Select } from "@components/select-rmes";

import { OperationsApi } from "@sdk/operations-api";

import { EMPTY_ARRAY, sortArrayByLabel } from "@utils/array-utils";
import { cx } from "@utils/cx";
import { useGoBack } from "@utils/hooks/useGoBack";

import D from "../../../../deprecated-locales";
import { flattenTree, isAutoUpdatedFromModified, rangeType } from "../../../utils/msd";
import { SimsContextProvider } from "../../context";
import { computeEssentialRubricContext } from "../../essential-rubric-context";
import { RubricEssentialMsg } from "../../rubric-essantial-msg";
import {
  getParentId,
  getParentIdName,
  hasLabelLg2,
  shouldDisplayTitleForPrimaryItem,
} from "../../utils";
import { DocumentFormPanel } from "./document-form-panel";
import { useDocumentsStoreContext } from "./documents-store-context";
/** @typedef {import("./sims-creation.types").SimsCreationError} SimsCreationError */
import { Menu } from "./menu";
import "./sims-creation.scss";
import SimsDocumentField from "./sims-document-field";
import { SimsField as Field } from "./sims-field";
import { getDefaultSims, getSiblingSims } from "./utils/getSims";

const { RICH_TEXT } = rangeType;

export const generateSimsBeforeSubmit = (
  simsProp,
  parentType,
  idParent,
  rubrics,
  metadataStructure,
) => {
  const autoUpdatedIds = collectAutoUpdatedIds(metadataStructure);
  const finalRubrics =
    autoUpdatedIds.size === 0
      ? rubrics
      : applyAutoUpdatedDate(rubrics, autoUpdatedIds, new Date().toISOString());

  return {
    id: simsProp.id,
    labelLg1: simsProp.labelLg1,
    labelLg2: simsProp.labelLg2,
    [getParentIdName(parentType)]: idParent,
    created: simsProp.created,
    rubrics: finalRubrics,
  };
};

const collectAutoUpdatedIds = (metadataStructure) => {
  if (!metadataStructure) return new Set();
  const flat = flattenTree(metadataStructure) || {};
  return new Set(
    Object.values(flat)
      .filter((node) => isAutoUpdatedFromModified(node))
      .map((node) => node.idMas),
  );
};

const applyAutoUpdatedDate = (rubrics, autoUpdatedIds, isoNow) => {
  const apply = (rubric) =>
    autoUpdatedIds.has(rubric.idAttribute || rubric.idMas) ? { ...rubric, value: isoNow } : rubric;
  if (Array.isArray(rubrics)) return rubrics.map(apply);
  return Object.fromEntries(Object.entries(rubrics).map(([k, v]) => [k, apply(v)]));
};

/**
 * @param {{ error?: SimsCreationError } & Record<string, unknown>} props
 */
const SimsCreation = ({
  mode,
  idParent: idParentProp,
  sims: simsProp,
  defaultSimsRubrics,
  metadataStructure,
  parentType,
  onSubmit,
  codesLists = {},
  organisations = EMPTY_ARRAY,
  parentWithSims,
  error,
}) => {
  const goBack = useGoBack();
  const { t } = useTranslation();
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const secondLang = true;
  const idParent = idParentProp || getParentId(simsProp);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return changed && currentLocation.pathname !== nextLocation.pathname;
  });

  const [sims, setSims] = useState(() =>
    getDefaultSims(mode, simsProp.rubrics || defaultSimsRubrics, metadataStructure),
  );

  const essentialRubricContext = useMemo(
    () => computeEssentialRubricContext(metadataStructure, sims),
    [metadataStructure, sims],
  );

  const handleChange = useCallback((e) => {
    setChanged(true);
    setSims((sims) => ({ ...sims, [e.id]: { ...sims[e.id], ...e.override } }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);

    const idParentToSave = idParent || idParentProp;
    const rubrics = Object.values(sims);

    setChanged(false);

    onSubmit(
      generateSimsBeforeSubmit(simsProp, parentType, idParentToSave, rubrics, metadataStructure),
      (id) => {
        setSaving(false);
        goBack(`/operations/sims/${id}`, true);
      },
      () => {
        setSaving(false);
      },
    );
  };

  const goBackUrl = sims.id
    ? `/operations/sims/${sims.id}`
    : `/operations/${parentType}/${idParent}`;

  const organisationsOptions = useMemo(
    () =>
      sortArrayByLabel(
        organisations.map((c) => ({
          label: c.label,
          value: c.id,
        })),
      ),
    [organisations],
  );

  const organisationsOptionsLg2 = useMemo(
    () =>
      sortArrayByLabel(
        organisations.map((c) => ({
          label: c.labelLg2,
          value: c.id,
        })),
      ),
    [organisations],
  );

  const operationsWithSimsOptions = useMemo(
    () =>
      (parentWithSims || [])
        .map((op) => ({
          label: op.labelLg1,
          value: op.idSims,
        }))
        .sort((o1, o2) => o1.label.toLowerCase().localeCompare(o2.label.toLowerCase())),
    [parentWithSims],
  );

  const MSDInformations = useCallback(
    (msd, handleChange, firstLevel = false) => {
      return (
        <Fragment key={msd.idMas}>
          {firstLevel && shouldDisplayTitleForPrimaryItem(msd) && (
            <h3 className="col-md-12 sims-title">
              {msd.idMas} - {msd.masLabelBasedOnCurrentLang}
            </h3>
          )}
          <div
            className={cx(
              "bauhaus-sims-field row",
              !secondLang
                ? "bauhaus-sims-field__" + msd.rangeType
                : "bauhaus-sims-field__" + msd.rangeType + "_2col",
            )}
            id={msd.idMas}
          >
            <div className="bauhaus-sims-field-form">
              {!msd.isPresentational && (
                <Field
                  msd={msd}
                  currentSection={sims[msd.idMas]}
                  handleChange={handleChange}
                  codesLists={codesLists}
                  secondLang={false}
                  alone={!hasLabelLg2(msd) || !secondLang}
                  organisationsOptions={organisationsOptions}
                  unbounded={msd.maxOccurs === "unbounded"}
                  simsModified={simsProp.updated}
                />
              )}
              {!msd.isPresentational && hasLabelLg2(msd) && secondLang && (
                <Field
                  msd={msd}
                  currentSection={sims[msd.idMas]}
                  handleChange={handleChange}
                  codesLists={codesLists}
                  secondLang={true}
                  alone={false}
                  organisationsOptions={organisationsOptionsLg2}
                  unbounded={msd.maxOccurs === "unbounded"}
                  simsModified={simsProp.updated}
                />
              )}
            </div>
            {sims[msd.idMas].rangeType !== rangeType.RUBRIQUE_SANS_OBJECT &&
              msd.rangeType === RICH_TEXT && (
                <div className="row bauhaus-documents-bloc">
                  <div className={`col-md-${secondLang ? 6 : 12}`}>
                    <SimsDocumentField
                      msd={msd}
                      currentSection={sims[msd.idMas]}
                      handleChange={handleChange}
                    />
                  </div>
                  {secondLang && (
                    <div className="col-md-6">
                      <SimsDocumentField
                        msd={msd}
                        currentSection={sims[msd.idMas]}
                        handleChange={handleChange}
                        lang="Lg2"
                      />
                    </div>
                  )}
                </div>
              )}
          </div>
          {Object.values(msd.children).map((child) => MSDInformations(child, handleChange))}
        </Fragment>
      );
    },
    [sims, codesLists, organisationsOptions, organisationsOptionsLg2, simsProp.updated],
  );

  const onSiblingSimsChange = () => {
    return (value) => {
      setLoading(true);
      getSiblingSims(value, metadataStructure).then((sims) => {
        setLoading(false);
        setSims(sims);
      });
    };
  };

  const { lateralPanelOpened, onLateralPanelHide } = useDocumentsStoreContext();

  if (loading) return <Loading />;
  if (saving) return <Saving />;

  return (
    <SimsContextProvider value={essentialRubricContext}>
      <Menu goBackUrl={goBackUrl} handleSubmit={handleSubmit} />

      {error && <ErrorBloc error={[t(`errors.${error.code}`, { id: error.details })]} D={D} />}

      <Modal
        className="Modal__Bootstrap modal-dialog operations structures-specification-modal"
        isOpen={blocker.state === "blocked"}
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <CloseIconButton onClick={() => blocker.reset()} />
            <h4 className="modal-title">{D.deleteTitle}</h4>
          </div>

          <div className="modal-body">{D.quitWithoutSaving}</div>
          <div className="modal-footer text-right">
            <ActionToolbar>
              <Button action={() => blocker.reset()}>{D.no}</Button>
              <Button action={() => blocker.proceed()}>{D.yes}</Button>
            </ActionToolbar>
          </div>
        </div>
      </Modal>

      <RubricEssentialMsg secondLang={secondLang} />

      <DocumentFormPanel
        opened={lateralPanelOpened}
        onHide={onLateralPanelHide}
        onAdd={(rubric, lang, newDocument) => {
          const rubricLang = lang === "lg1" ? "Lg1" : "Lg2";
          const currentDocuments = sims[rubric]["documents" + rubricLang] || [];
          handleChange({
            id: rubric,
            override: {
              ["documents" + rubricLang]: [...currentDocuments, newDocument],
            },
          });
        }}
      />

      {Object.values(metadataStructure).map((msd, index) => {
        return (
          <div key={msd.idMas} className="bauhaus-sims-creation">
            {index === 0 && (
              <>
                <CheckSecondLang />

                <Select
                  className="bauhaus-sims-duplicate"
                  placeholder={D.createFromAnExistingReport}
                  value={operationsWithSimsOptions.find(({ value }) => value === idParent)}
                  options={operationsWithSimsOptions}
                  onChange={onSiblingSimsChange()}
                  disabled={changed}
                  autofocus
                />
              </>
            )}
            {MSDInformations(msd, handleChange, true)}
          </div>
        );
      })}
    </SimsContextProvider>
  );
};

const withParentWithSims = (Component) => {
  return (props) => {
    const [parentWithSims, setParentWithSims] = useState([]);
    const parentType = props.parentType;
    const seriesId = props.parent?.series?.id;
    const familyId = props.parent?.family?.id;
    useEffect(() => {
      if (parentType === "operation" && seriesId) {
        OperationsApi.getOperationsWithReport(seriesId).then((result) => {
          setParentWithSims(result);
        });
      } else if (parentType === "series" && familyId) {
        OperationsApi.getSeriesWithReport(familyId).then((result) => {
          setParentWithSims(result);
        });
      } else if (parentType === "indicator") {
        OperationsApi.getIndicatorsListWithSims().then((result) => {
          setParentWithSims(result);
        });
      }
    }, [seriesId, parentType, familyId]);
    return <Component {...props} parentWithSims={parentWithSims} />;
  };
};

const AdvancedSimsCreation = withParentWithSims(SimsCreation);
export default AdvancedSimsCreation;
