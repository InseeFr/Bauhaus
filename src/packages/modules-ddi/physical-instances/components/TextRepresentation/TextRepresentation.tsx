import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useTranslation } from "react-i18next";
import type { TextRepresentation as TextRepresentationType } from "../../types/api";

interface TextRepresentationProps {
  representation?: TextRepresentationType;
  onChange: (representation: TextRepresentationType | undefined) => void;
}

const toInputValue = (n: number | undefined): string =>
  n === undefined || n === null ? "" : String(n);

export const TextRepresentation = ({
  representation,
  onChange,
}: Readonly<TextRepresentationProps>) => {
  const { t } = useTranslation();
  const [minLength, setMinLength] = useState(toInputValue(representation?.MinLength));
  const [maxLength, setMaxLength] = useState(toInputValue(representation?.MaxLength));
  const [regExp, setRegExp] = useState(representation?.RegExp || "");

  useEffect(() => {
    setMinLength(toInputValue(representation?.MinLength));
    setMaxLength(toInputValue(representation?.MaxLength));
    setRegExp(representation?.RegExp || "");
  }, [representation]);

  useEffect(() => {
    const newRepresentation: TextRepresentationType = {
      $type: "TextRepresentationBaseType",
    };

    if (minLength) newRepresentation.MinLength = Number(minLength);
    if (maxLength) newRepresentation.MaxLength = Number(maxLength);
    if (regExp) newRepresentation.RegExp = regExp;

    const hasContent =
      newRepresentation.MinLength !== undefined ||
      newRepresentation.MaxLength !== undefined ||
      newRepresentation.RegExp !== undefined;
    onChange(hasContent ? newRepresentation : undefined);
  }, [minLength, maxLength, regExp, onChange]);

  return (
    <>
      <div className="flex flex-column gap-2">
        <label htmlFor="min-length">{t("physicalInstance.view.text.minLength")}</label>
        <InputText
          id="min-length"
          name="textMinLength"
          type="number"
          autoComplete="off"
          value={minLength}
          onChange={(e) => setMinLength(e.target.value)}
        />
      </div>

      <div className="flex flex-column gap-2">
        <label htmlFor="max-length">{t("physicalInstance.view.text.maxLength")}</label>
        <InputText
          id="max-length"
          name="textMaxLength"
          type="number"
          autoComplete="off"
          value={maxLength}
          onChange={(e) => setMaxLength(e.target.value)}
        />
      </div>

      <div className="flex flex-column gap-2">
        <label htmlFor="reg-exp">{t("physicalInstance.view.text.regExp")}</label>
        <InputText
          id="reg-exp"
          name="textRegExp"
          autoComplete="off"
          value={regExp}
          onChange={(e) => setRegExp(e.target.value)}
        />
      </div>
    </>
  );
};
