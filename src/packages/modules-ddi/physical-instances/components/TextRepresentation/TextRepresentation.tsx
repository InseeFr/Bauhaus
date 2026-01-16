import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useTranslation } from "react-i18next";
import type { TextRepresentation as TextRepresentationType } from "../../types/api";

interface TextRepresentationProps {
  representation?: TextRepresentationType;
  onChange: (representation: TextRepresentationType | undefined) => void;
}

export const TextRepresentation = ({
  representation,
  onChange,
}: Readonly<TextRepresentationProps>) => {
  const { t } = useTranslation();
  const [minLength, setMinLength] = useState(representation?.["@minLength"] || "");
  const [maxLength, setMaxLength] = useState(representation?.["@maxLength"] || "");
  const [regExp, setRegExp] = useState(representation?.["@regExp"] || "");

  useEffect(() => {
    setMinLength(representation?.["@minLength"] || "");
    setMaxLength(representation?.["@maxLength"] || "");
    setRegExp(representation?.["@regExp"] || "");
  }, [representation]);

  useEffect(() => {
    const newRepresentation: TextRepresentationType = {};

    if (minLength) {
      newRepresentation["@minLength"] = minLength;
    }

    if (maxLength) {
      newRepresentation["@maxLength"] = maxLength;
    }

    if (regExp) {
      newRepresentation["@regExp"] = regExp;
    }

    onChange(Object.keys(newRepresentation).length > 0 ? newRepresentation : undefined);
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
