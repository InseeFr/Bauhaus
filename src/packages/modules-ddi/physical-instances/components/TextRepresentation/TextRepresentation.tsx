import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { InputText } from "@components/ui/input-text";

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

  const emit = (min: string, max: string, reg: string) => {
    const newRepresentation: TextRepresentationType = {
      $type: "TextRepresentationBaseType",
    };

    if (min) newRepresentation.MinLength = Number(min);
    if (max) newRepresentation.MaxLength = Number(max);
    if (reg) newRepresentation.RegExp = reg;

    // #1592 : on émet toujours la représentation, même sans aucun attribut, sinon le type
    // « Text » disparaît du DDI exporté (<VariableRepresentation/> vide au lieu de
    // <r:TextRepresentation/>).
    onChange(newRepresentation);
  };

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
          onChange={(e) => {
            setMinLength(e.target.value);
            emit(e.target.value, maxLength, regExp);
          }}
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
          onChange={(e) => {
            setMaxLength(e.target.value);
            emit(minLength, e.target.value, regExp);
          }}
        />
      </div>

      <div className="flex flex-column gap-2">
        <label htmlFor="reg-exp">{t("physicalInstance.view.text.regExp")}</label>
        <InputText
          id="reg-exp"
          name="textRegExp"
          autoComplete="off"
          value={regExp}
          onChange={(e) => {
            setRegExp(e.target.value);
            emit(minLength, maxLength, e.target.value);
          }}
        />
      </div>
    </>
  );
};
