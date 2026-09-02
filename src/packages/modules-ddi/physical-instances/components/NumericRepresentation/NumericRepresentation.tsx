import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import type { NumericRepresentation as NumericRepresentationType } from "../../types/api";

interface NumericRepresentationProps {
  representation?: NumericRepresentationType;
  onChange: (representation: NumericRepresentationType | undefined) => void;
}

const NUMERIC_TYPE_OPTIONS = [
  { value: "BigInteger", label: "BigInteger" },
  { value: "Integer", label: "Integer" },
  { value: "Short", label: "Short" },
  { value: "Decimal", label: "Decimal" },
  { value: "Float", label: "Float" },
  { value: "Double", label: "Double" },
  { value: "Count", label: "Count" },
  { value: "Incremental", label: "Incremental" },
];

export const NumericRepresentation = ({
  representation,
  onChange,
}: Readonly<NumericRepresentationProps>) => {
  const { t } = useTranslation();
  const formatNumber = (n: number | undefined): string =>
    n === undefined || n === null ? "" : String(n);

  const [numericTypeCode, setNumericTypeCode] = useState(
    representation?.NumericTypeCode || "Integer",
  );
  const [minValue, setMinValue] = useState(formatNumber(representation?.NumberRange?.Low?.value));
  const [maxValue, setMaxValue] = useState(formatNumber(representation?.NumberRange?.High?.value));
  const [hasMin, setHasMin] = useState(!!representation?.NumberRange?.Low);
  const [hasMax, setHasMax] = useState(!!representation?.NumberRange?.High);

  useEffect(() => {
    setNumericTypeCode(representation?.NumericTypeCode || "Integer");
    setMinValue(formatNumber(representation?.NumberRange?.Low?.value));
    setMaxValue(formatNumber(representation?.NumberRange?.High?.value));
    setHasMin(!!representation?.NumberRange?.Low);
    setHasMax(!!representation?.NumberRange?.High);
  }, [representation]);

  useEffect(() => {
    const numberRange: {
      Low?: { IsInclusive: boolean; value: number };
      High?: { IsInclusive: boolean; value: number };
    } = {};

    if (hasMin && minValue !== "") {
      numberRange.Low = { IsInclusive: true, value: Number(minValue) };
    }

    if (hasMax && maxValue !== "") {
      numberRange.High = { IsInclusive: true, value: Number(maxValue) };
    }

    const newRepresentation: NumericRepresentationType = {
      $type: "NumericRepresentationBaseType",
      NumericTypeCode: numericTypeCode,
      ...(Object.keys(numberRange).length > 0 && { NumberRange: numberRange }),
    };

    onChange(newRepresentation);
  }, [numericTypeCode, minValue, maxValue, hasMin, hasMax, onChange]);

  return (
    <>
      <div className="flex flex-column gap-2">
        <label htmlFor="numeric-type">{t("physicalInstance.view.numeric.type")}</label>
        <Dropdown
          id="numeric-type"
          name="numericType"
          value={numericTypeCode}
          onChange={(e) => setNumericTypeCode(e.value)}
          options={NUMERIC_TYPE_OPTIONS}
          placeholder={t("physicalInstance.view.numeric.selectType")}
        />
      </div>

      <div className="flex flex-column gap-2">
        {hasMin ? (
          <>
            <label htmlFor="min-value">{t("physicalInstance.view.numeric.min")}</label>
            <div className="flex gap-2">
              <InputText
                id="min-value"
                name="numericMinValue"
                type="number"
                autoComplete="off"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                label={t("physicalInstance.view.delete")}
                outlined
                onClick={() => {
                  setHasMin(false);
                  setMinValue("");
                }}
              />
            </div>
          </>
        ) : (
          <Button
            type="button"
            label={t("physicalInstance.view.numeric.addMinBound")}
            outlined
            onClick={() => {
              setHasMin(true);
              setMinValue("0");
            }}
          />
        )}
      </div>

      <div className="flex flex-column gap-2">
        {hasMax ? (
          <>
            <label htmlFor="max-value">{t("physicalInstance.view.numeric.max")}</label>
            <div className="flex gap-2">
              <InputText
                id="max-value"
                name="numericMaxValue"
                type="number"
                autoComplete="off"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                label={t("physicalInstance.view.delete")}
                outlined
                onClick={() => {
                  setHasMax(false);
                  setMaxValue("");
                }}
              />
            </div>
          </>
        ) : (
          <Button
            type="button"
            label={t("physicalInstance.view.numeric.addMaxBound")}
            outlined
            onClick={() => {
              setHasMax(true);
              setMaxValue("0");
            }}
          />
        )}
      </div>
    </>
  );
};
