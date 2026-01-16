import { useRef, useState } from "react";
import { D1, D2 } from "../../../../deprecated-locales";
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
  const dictionary = secondLang ? D2 : D1;
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
          message={D1.simsConfirmationMessage}
        />
      )}
      <label>
        {dictionary.simsWithoutObject}
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
