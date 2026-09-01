import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationDelete } from "@components/confirmation-delete";

export const SimsWithoutObjectCheckbox = ({
  checked,
  displayConfirmation,
  onChange,
  secondLang,
}: Readonly<{
  checked: boolean;
  displayConfirmation: boolean;
  onChange: (checked: boolean) => void;
  secondLang: boolean;
}>) => {
  const { t } = useTranslation();

  const [modalDisplay, setModalDisplayMode] = useState<boolean>(false);

  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="without-object form-group col-md-12">
      {modalDisplay && (
        <ConfirmationDelete
          className="operations"
          handleNo={() => setModalDisplayMode(false)}
          handleYes={() => {
            setModalDisplayMode(false);
            onChange(true);
          }}
          message={t("sims.simsConfirmationMessage", { lng: "fr" })}
        />
      )}
      <label>
        {t("sims.simsWithoutObject", { lng: secondLang ? "en" : "fr" })}
        <input
          ref={input}
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            if (e.target.checked && displayConfirmation) {
              setModalDisplayMode(true);
            } else {
              onChange(e.target.checked);
            }
          }}
        />
      </label>
    </div>
  );
};
