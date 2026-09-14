import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { DatePicker } from "@components/date-picker";
import { InputRmes } from "@components/input-rmes";
import { Note } from "@components/note";
import { MDEditor } from "@components/rich-editor/react-md-editor";
import { Select } from "@components/select-rmes";

import { sortArrayByLabel } from "@utils/array-utils";
import { useOrganizations } from "@utils/hooks/organizations";

import { SimsGeographyPicker } from "../../../../components/SimsGeographyPicker";
import { rangeType } from "../../../../constants/rangeType";
import { isAutoUpdatedFromModified } from "../../../../utils/isAutoUpdatedFromModified";
import { SimsFieldTitle } from "../../components/SimsFieldTitle";
import "./SimsField.css";
import { SimsCodelistSelect } from "./SimsCodelistSelect";
import { SimsWithoutObjectCheckbox } from "./SimsWithoutObjectCheckbox";

const { RICH_TEXT, TEXT, DATE, CODE_LIST, ORGANIZATION, GEOGRAPHY } = rangeType;

interface SimsFieldTypes {
  msd: any;
  currentSection?: any;
  secondLang?: boolean;
  alone?: boolean;
  unbounded?: boolean;
  codelists?: any;
  handleChange?: (event: { id: string; override: any }) => void;
  simsModified?: string;
  /** Uniquement lu par le comparateur de `memo` en bas de fichier. */
  organizationsOptions?: any;
}

const SimsFieldComponent = ({
  msd,
  currentSection = {},
  secondLang,
  alone,
  unbounded,
  codelists,
  handleChange,
  simsModified,
  // Uniquement lu par le comparateur de `memo` en bas de fichier.
  organizationsOptions: _organizationsOptions,
}: Readonly<SimsFieldTypes>) => {
  const { t } = useTranslation();

  const autoUpdatedFromModified = isAutoUpdatedFromModified(msd);

  const { data: organizations = [] } = useOrganizations();

  const organizationsIriOptions = useMemo(
    () => organizations.map((o) => ({ value: o.iri, label: o.label })),
    [organizations],
  );

  const value = useMemo(() => {
    switch (msd.rangeType) {
      case TEXT:
        return currentSection[secondLang ? "labelLg2" : "labelLg1"];
      case ORGANIZATION:
        return currentSection.value;
      case DATE:
        return autoUpdatedFromModified ? simsModified : currentSection.value;
      case RICH_TEXT:
        return currentSection[secondLang ? "labelLg2" : "labelLg1"];
      case GEOGRAPHY:
        return currentSection.uri;
      case CODE_LIST:
        return currentSection.value;
      default:
        return currentSection.value;
    }
  }, [msd.rangeType, currentSection, secondLang, autoUpdatedFromModified, simsModified]);

  const [localMdValue, setLocalMdValue] = useState(value);

  useEffect(() => {
    if (msd.rangeType === RICH_TEXT) {
      setLocalMdValue(value);
    }
  }, [value, msd.rangeType]);

  const handleChangeInternal = useCallback(
    (override: any) => {
      handleChange?.({
        id: msd.idMas,
        override,
      });
    },
    [handleChange, msd.idMas],
  );

  const handleWithoutObject = useCallback(
    (value: boolean) => {
      if (value) {
        handleChangeInternal({ rangeType: rangeType.RUBRIQUE_SANS_OBJECT });
      } else {
        handleChangeInternal({ rangeType: msd.rangeType });
      }
    },
    [handleChangeInternal, msd.rangeType],
  );

  const handleTextInput = useCallback(
    (value: string) => {
      handleChangeInternal({
        [secondLang ? "labelLg2" : "labelLg1"]: value,
      });
    },
    [handleChangeInternal, secondLang],
  );

  const handleMdChange = useCallback((value?: string) => {
    setLocalMdValue(value);
  }, []);

  const handleMdBlur = useCallback(() => {
    handleChangeInternal({
      [secondLang ? "labelLg2" : "labelLg1"]: localMdValue,
    });
  }, [handleChangeInternal, secondLang, localMdValue]);

  const handleCodelistInput = useCallback(
    (value: any) => {
      handleChangeInternal({ codeList: msd.codeList, value });
    },
    [handleChangeInternal, msd.codeList],
  );

  const handleGeography = useCallback(
    (uri?: string) => {
      handleChangeInternal({ uri });
    },
    [handleChangeInternal],
  );

  const codelist = codelists[msd.codeList] || {};
  const codes = codelist.codes || [];

  const codelistOptions = useMemo(
    () =>
      sortArrayByLabel(
        codes.map((c: any) => ({
          label: c.labelLg1,
          value: c.code,
        })),
      ),
    [codes],
  );

  const codelistOptionsLg2 = useMemo(
    () =>
      sortArrayByLabel(
        codes.map((c: any) => ({
          label: c.labelLg2,
          value: c.code,
        })),
      ),
    [codes],
  );

  return (
    <Note
      title={<SimsFieldTitle currentSection={currentSection} msd={msd} secondLang={secondLang} />}
      alone={alone}
      text={
        !msd.isPresentational && (
          <>
            {msd.sansObject && (
              <SimsWithoutObjectCheckbox
                checked={currentSection.rangeType === rangeType.RUBRIQUE_SANS_OBJECT}
                onChange={handleWithoutObject}
                displayConfirmation={!!value}
                secondLang={!!secondLang}
              />
            )}
            {currentSection.rangeType !== rangeType.RUBRIQUE_SANS_OBJECT && (
              <span className="sims-field">
                {msd.rangeType === TEXT && (
                  // `id` n'est pas déclaré dans `InputRmesTypes` et `label` n'y a pas de valeur
                  // par défaut : le composant partagé ignore déjà `id` et rend `label` vide côté
                  // SIMS. On passe l'objet de props tel quel via un spread non littéral pour ne
                  // pas déclencher les vérifications strictes de TypeScript, sans rien changer au
                  // rendu existant.
                  <InputRmes
                    {...({
                      id: msd.idMas,
                      value,
                      handleChange: handleTextInput,
                      arias: {
                        "aria-label": t("sims.simsValue"),
                      },
                      className: "w-100",
                    } as any)}
                  />
                )}
                {msd.rangeType === ORGANIZATION && (
                  <Select
                    placeholder=""
                    value={
                      organizations.find((o) => o.iri === value || o.id === value)?.iri ?? value
                    }
                    options={organizationsIriOptions}
                    onChange={handleCodelistInput}
                  />
                )}
                {msd.rangeType === DATE && (
                  // `aria-label`, `id`, `colMd` et `secondLang` ne sont pas déclarés dans
                  // `DatePickerTypes` : déjà ignorés par le composant partagé aujourd'hui. Même
                  // remarque que pour `InputRmes` ci-dessus.
                  <DatePicker
                    {...({
                      "aria-label": t("sims.simsValue"),
                      id: msd.idMas,
                      colMd: 12,
                      value,
                      onChange: autoUpdatedFromModified ? undefined : handleCodelistInput,
                      secondLang,
                      disabled: autoUpdatedFromModified,
                    } as any)}
                  />
                )}
                {msd.rangeType === RICH_TEXT && (
                  <div onBlur={handleMdBlur}>
                    <MDEditor text={localMdValue} handleChange={handleMdChange} />
                  </div>
                )}
                {msd.rangeType === CODE_LIST &&
                  codelist && (
                    // `aria-label` est transmis tel quel au `Select` sous-jacent via `...rest`,
                    // mais n'apparaît pas dans `SimsCodelistSelectTypes`.
                    <SimsCodelistSelect
                      {...({
                        "aria-label": codelist.codeListLabelLg1,
                        currentSection,
                        options: secondLang ? codelistOptionsLg2 : codelistOptions,
                        onChange: handleCodelistInput,
                        multi: unbounded,
                      } as any)}
                    />
                  )}
                {msd.rangeType === GEOGRAPHY && (
                  // `loadGeographies` est requis par `SimsGeographyPicker` mais n'a jamais été
                  // fourni ici : comportement historique inchangé (le composant partagé
                  // planterait déjà à l'exécution si ce champ est réellement sauvegardé).
                  <SimsGeographyPicker
                    {...({
                      value,
                      onChange: handleGeography,
                      secondLang,
                    } as any)}
                  />
                )}
              </span>
            )}
          </>
        )
      }
    />
  );
};

export const SimsField = memo(SimsFieldComponent, (prevProps, nextProps) => {
  return (
    prevProps.msd.idMas === nextProps.msd.idMas &&
    prevProps.currentSection === nextProps.currentSection &&
    prevProps.secondLang === nextProps.secondLang &&
    prevProps.alone === nextProps.alone &&
    prevProps.unbounded === nextProps.unbounded &&
    prevProps.simsModified === nextProps.simsModified &&
    prevProps.codelists === nextProps.codelists &&
    prevProps.organizationsOptions === nextProps.organizationsOptions
  );
});
