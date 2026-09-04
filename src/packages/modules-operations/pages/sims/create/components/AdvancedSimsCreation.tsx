import { Fragment, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import { useBlocker } from "react-router-dom";

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

import { rangeType } from "../../../../constants/rangeType";
import { flattenTree } from "../../../../utils/flattenTree";
import { isAutoUpdatedFromModified } from "../../../../utils/isAutoUpdatedFromModified";
import { RubricEssentialMsg } from "../../components/RubricEssentialMsg";
import { Mode } from "../../constants";
import { useDocumentsStoreContext } from "../../hooks/useDocumentsStoreContext";
import {
  computeEssentialRubricContext,
  EssentialRubricContextProvider,
} from "../../hooks/useEssentialRubricContext";
import { hasLabelLg2 } from "../../utils/hasLabelLg2";
import { shouldDisplayTitleForPrimaryItem } from "../../utils/shouldDisplayTitleForPrimaryItem";
import { Menu } from "../menu";
import { getDefaultSims } from "../utils/getDefaultSims";
import { getParentId } from "../utils/getParentId";
import { getParentIdName } from "../utils/getParentIdName";
import "./AdvancedSimsCreation.css";
import { getSiblingSims } from "../utils/getSiblingSims";
import { DocumentFormPanel } from "./DocumentFormPanel";
import { SimsDocumentFieldMemo } from "./SimsDocumentField";
import { SimsField } from "./SimsField";

const { RICH_TEXT } = rangeType;

export const generateSimsBeforeSubmit = (
  simsProp: any,
  parentType: string,
  idParent: string,
  rubrics: any,
  metadataStructure?: any,
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
    [getParentIdName(parentType as "operation" | "series" | "indicator") as string]: idParent,
    created: simsProp.created,
    rubrics: finalRubrics,
  };
};

const collectAutoUpdatedIds = (metadataStructure: any) => {
  if (!metadataStructure) return new Set();
  const flat = flattenTree(metadataStructure) || {};
  return new Set(
    Object.values(flat)
      .filter((node: any) => isAutoUpdatedFromModified(node))
      .map((node: any) => node.idMas),
  );
};

const applyAutoUpdatedDate = (rubrics: any, autoUpdatedIds: Set<any>, isoNow: string) => {
  const apply = (rubric: any) =>
    autoUpdatedIds.has(rubric.idAttribute || rubric.idMas) ? { ...rubric, value: isoNow } : rubric;
  if (Array.isArray(rubrics)) return rubrics.map(apply);
  return Object.fromEntries(Object.entries(rubrics).map(([k, v]) => [k, apply(v)]));
};

interface SimsCreationTypes {
  mode: Mode;
  idParent?: string;
  sims: any;
  defaultSimsRubrics?: any;
  metadataStructure: any;
  parentType: string;
  onSubmit: (sims: any, onSuccess: (id: string) => void, onError: () => void) => void;
  codelists?: any;
  organizations?: any[];
  parentWithSims?: any[];
  /** Le shape réel dépend de l'appelant (ex. `unknown` côté page.tsx) : pas de
   * modèle d'erreur unique côté SIMS. */
  error?: any;
  /** Non consommé par ce composant (il utilise `useGoBack()` en interne) mais
   * transmis tel quel par certains appelants. */
  goBack?: any;
}

const SimsCreation = ({
  mode,
  idParent: idParentProp,
  sims: simsProp,
  defaultSimsRubrics,
  metadataStructure,
  parentType,
  onSubmit,
  codelists = {},
  organizations = EMPTY_ARRAY,
  parentWithSims,
  error,
}: Readonly<SimsCreationTypes>) => {
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

  const handleChange = useCallback((e: { id: string; override: any }) => {
    setChanged(true);
    setSims((sims) => ({ ...sims, [e.id]: { ...sims[e.id], ...e.override } }));
  }, []);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setSaving(true);
    const idParentToSave = idParent || idParentProp;
    const rubrics = Object.values(sims);
    setChanged(false);
    onSubmit(
      generateSimsBeforeSubmit(simsProp, parentType, idParentToSave!, rubrics, metadataStructure),
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

  const organizationsOptions = useMemo(
    () =>
      sortArrayByLabel(
        organizations.map((c) => ({
          label: c.label,
          value: c.id,
        })),
      ),
    [organizations],
  );

  const organizationsOptionsLg2 = useMemo(
    () =>
      sortArrayByLabel(
        organizations.map((c) => ({
          label: c.labelLg2,
          value: c.id,
        })),
      ),
    [organizations],
  );

  const operationsWithSimsOptions = useMemo(
    () =>
      (parentWithSims || [])
        .map((op: any) => ({
          label: op.labelLg1,
          value: op.idSims,
        }))
        .sort((o1, o2) => o1.label.toLowerCase().localeCompare(o2.label.toLowerCase())),
    [parentWithSims],
  );

  const MSDInformations = useCallback(
    (msd: any, handleChange: (e: { id: string; override: any }) => void, firstLevel = false) => {
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
                <SimsField
                  msd={msd}
                  currentSection={sims[msd.idMas]}
                  handleChange={handleChange}
                  codelists={codelists}
                  secondLang={false}
                  alone={!hasLabelLg2(msd) || !secondLang}
                  organizationsOptions={organizationsOptions}
                  unbounded={msd.maxOccurs === "unbounded"}
                  simsModified={simsProp.updated}
                />
              )}
              {!msd.isPresentational && hasLabelLg2(msd) && secondLang && (
                <SimsField
                  msd={msd}
                  currentSection={sims[msd.idMas]}
                  handleChange={handleChange}
                  codelists={codelists}
                  secondLang={true}
                  alone={false}
                  organizationsOptions={organizationsOptionsLg2}
                  unbounded={msd.maxOccurs === "unbounded"}
                  simsModified={simsProp.updated}
                />
              )}
            </div>
            {sims[msd.idMas].rangeType !== rangeType.RUBRIQUE_SANS_OBJECT &&
              msd.rangeType === RICH_TEXT && (
                <div className="row bauhaus-documents-bloc">
                  <div className={`col-md-${secondLang ? 6 : 12}`}>
                    <SimsDocumentFieldMemo
                      msd={msd}
                      currentSection={sims[msd.idMas]}
                      handleChange={handleChange}
                    />
                  </div>
                  {secondLang && (
                    <div className="col-md-6">
                      <SimsDocumentFieldMemo
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
    [sims, codelists, organizationsOptions, organizationsOptionsLg2, simsProp.updated],
  );

  const onSiblingSimsChange = () => {
    return (value: string) => {
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
    <EssentialRubricContextProvider value={essentialRubricContext}>
      <Menu goBackUrl={goBackUrl} handleSubmit={handleSubmit} />
      {error && <ErrorBloc error={[t(`errors.${error.code}`, { id: error.details })]} />}
      <Modal
        className="Modal__Bootstrap modal-dialog operations structures-specification-modal"
        isOpen={blocker.state === "blocked"}
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <CloseIconButton onClick={() => blocker.reset?.()} />
            <h4 className="modal-title">{t("app.deleteTitle")}</h4>
          </div>

          <div className="modal-body">{t("app.quitWithoutSaving")}</div>
          <div className="modal-footer text-right">
            <ActionToolbar>
              <Button action={() => blocker.reset?.()}>{t("app.no")}</Button>
              <Button action={() => blocker.proceed?.()}>{t("app.yes")}</Button>
            </ActionToolbar>
          </div>
        </div>
      </Modal>
      <RubricEssentialMsg secondLang={secondLang} />
      <DocumentFormPanel
        opened={!!lateralPanelOpened}
        onHide={onLateralPanelHide ?? (() => {})}
        onAdd={(rubric, lang, newDocument) => {
          const rubricLang = lang === "lg1" ? "Lg1" : "Lg2";
          const currentDocuments = (sims[rubric!] as any)["documents" + rubricLang] || [];
          handleChange({
            id: rubric!,
            override: {
              ["documents" + rubricLang]: [...currentDocuments, newDocument],
            },
          });
        }}
      />
      {Object.values(metadataStructure).map((msd: any, index: number) => {
        return (
          <div key={msd.idMas} className="bauhaus-sims-creation">
            {index === 0 && (
              <>
                <CheckSecondLang />

                <Select
                  {...{
                    className: "bauhaus-sims-duplicate",
                    autofocus: true,
                  }}
                  placeholder={t("sims.createFromAnExistingReport")}
                  value={operationsWithSimsOptions.find(({ value }) => value === idParent)}
                  options={operationsWithSimsOptions}
                  onChange={onSiblingSimsChange()}
                  disabled={changed}
                />
              </>
            )}
            {MSDInformations(msd, handleChange, true)}
          </div>
        );
      })}
    </EssentialRubricContextProvider>
  );
};

interface WithParentWithSimsProps extends Omit<SimsCreationTypes, "parentWithSims"> {
  parent?: {
    series?: { id?: string };
    family?: { id?: string };
  };
}

const withParentWithSims = (Component: (props: Readonly<SimsCreationTypes>) => JSX.Element) => {
  return (props: Readonly<WithParentWithSimsProps>) => {
    const [parentWithSims, setParentWithSims] = useState<any[]>([]);

    const parentType = props.parentType;

    const seriesId = props.parent?.series?.id;

    const familyId = props.parent?.family?.id;

    useEffect(() => {
      if (parentType === "operation" && seriesId) {
        OperationsApi.getOperationsWithReport(seriesId).then((result: unknown) => {
          setParentWithSims(result as any[]);
        });
      } else if (parentType === "series" && familyId) {
        OperationsApi.getSeriesWithReport(familyId).then((result: unknown) => {
          setParentWithSims(result as any[]);
        });
      } else if (parentType === "indicator") {
        OperationsApi.getIndicatorsListWithSims().then((result: unknown) => {
          setParentWithSims(result as any[]);
        });
      }
    }, [seriesId, parentType, familyId]);
    return <Component {...props} parentWithSims={parentWithSims} />;
  };
};

export const AdvancedSimsCreation = withParentWithSims(SimsCreation);
