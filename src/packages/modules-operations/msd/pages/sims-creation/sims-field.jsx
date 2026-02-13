import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { DatePicker } from "@components/date-picker";
import { InputRmes } from "@components/input-rmes";
import { Note } from "@components/note";
import { Select } from "@components/select-rmes";

import { sortArrayByLabel } from "@utils/array-utils";

import D from "../../../../deprecated-locales";
import SimsGeographyPicker from "../../../components/sims/sims-geography-picker";
import { rangeType } from "../../../utils/msd";
import { SimsFieldTitle } from "../../sims-field-title";
import { SimsCodeListSelect } from "./sims-code-list-select";
import "./sims-field.css";
import { SimsWithoutObjectCheckbox } from "./sims-without-object-checkbox";
import { MDEditor } from "@components/rich-editor/react-md-editor";

const { RICH_TEXT, TEXT, DATE, CODE_LIST, ORGANIZATION, GEOGRAPHY } = rangeType;

const SimsFieldComponent = ({
  msd,
  currentSection = {},
  secondLang,
  alone,
  organisationsOptions = [],
  unbounded,
  codesLists,
  handleChange,
}) => {
  const value = useMemo(() => {
    switch (msd.rangeType) {
      case TEXT:
        return currentSection[secondLang ? "labelLg2" : "labelLg1"];
      case ORGANIZATION:
        return currentSection.value;
      case DATE:
        return currentSection.value;
      case RICH_TEXT:
        return currentSection[secondLang ? "labelLg2" : "labelLg1"];
      case GEOGRAPHY:
        return currentSection.uri;
      case CODE_LIST:
        return currentSection.value;
      default:
        return currentSection.value;
    }
  }, [msd.rangeType, currentSection, secondLang]);

  const [localMdValue, setLocalMdValue] = useState(value);

  useEffect(() => {
    if (msd.rangeType === RICH_TEXT) {
      setLocalMdValue(value);
    }
  }, [value, msd.rangeType]);

  const handleChangeInternal = useCallback(
    (override) => {
      handleChange({
        id: msd.idMas,
        override,
      });
    },
    [handleChange, msd.idMas],
  );

  const handleWithoutObject = useCallback(
    (value) => {
      if (value) {
        handleChangeInternal({ rangeType: rangeType.RUBRIQUE_SANS_OBJECT });
      } else {
        handleChangeInternal({ rangeType: msd.rangeType });
      }
    },
    [handleChangeInternal, msd.rangeType],
  );

  const handleTextInput = useCallback(
    (value) => {
      handleChangeInternal({
        [secondLang ? "labelLg2" : "labelLg1"]: value,
      });
    },
    [handleChangeInternal, secondLang],
  );

  const handleMdChange = useCallback((value) => {
    setLocalMdValue(value);
  }, []);

  const handleMdBlur = useCallback(() => {
    handleChangeInternal({
      [secondLang ? "labelLg2" : "labelLg1"]: localMdValue,
    });
  }, [handleChangeInternal, secondLang, localMdValue]);

  const handleCodeListInput = useCallback(
    (value) => {
      handleChangeInternal({ codeList: msd.codeList, value });
    },
    [handleChangeInternal, msd.codeList],
  );

  const handleGeography = useCallback(
    (uri) => {
      handleChangeInternal({ uri });
    },
    [handleChangeInternal],
  );

  const codesList = codesLists[msd.codeList] || {};
  const codes = codesList.codes || [];

  const codesListOptions = useMemo(
    () =>
      sortArrayByLabel(
        codes.map((c) => ({
          label: c.labelLg1,
          value: c.code,
        })),
      ),
    [codes],
  );

  const codesListOptionsLg2 = useMemo(
    () =>
      sortArrayByLabel(
        codes.map((c) => ({
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
                secondLang={secondLang}
              />
            )}
            {currentSection.rangeType !== rangeType.RUBRIQUE_SANS_OBJECT && (
              <span className="sims-field">
                {msd.rangeType === TEXT && (
                  <InputRmes
                    id={msd.idMas}
                    value={value}
                    handleChange={handleTextInput}
                    arias={{
                      "aria-label": D.simsValue,
                    }}
                    className="w-100"
                  />
                )}
                {msd.rangeType === ORGANIZATION && (
                  <>
                    <Select
                      placeholder=""
                      value={value}
                      options={organisationsOptions}
                      onChange={handleCodeListInput}
                    />
                  </>
                )}
                {msd.rangeType === DATE && (
                  <DatePicker
                    aria-label={D.simsValue}
                    id={msd.idMas}
                    colMd={12}
                    value={value}
                    onChange={handleCodeListInput}
                    secondLang={secondLang}
                  />
                )}

                {msd.rangeType === RICH_TEXT && (
                  <div onBlur={handleMdBlur}>
                    <MDEditor text={localMdValue} handleChange={handleMdChange} />
                  </div>
                )}

                {msd.rangeType === CODE_LIST && codesList && (
                  <SimsCodeListSelect
                    aria-label={codesList.codeListLabelLg1}
                    currentSection={currentSection}
                    options={secondLang ? codesListOptionsLg2 : codesListOptions}
                    onChange={handleCodeListInput}
                    multi={unbounded}
                  />
                )}

                {msd.rangeType === GEOGRAPHY && (
                  <SimsGeographyPicker
                    value={value}
                    onChange={handleGeography}
                    secondLang={secondLang}
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
  // Ne re-render que si le currentSection de CE champ a changé
  return (
    prevProps.msd.idMas === nextProps.msd.idMas &&
    prevProps.currentSection === nextProps.currentSection &&
    prevProps.secondLang === nextProps.secondLang &&
    prevProps.alone === nextProps.alone &&
    prevProps.unbounded === nextProps.unbounded
  );
});
