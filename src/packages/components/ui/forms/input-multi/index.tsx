import { Chips } from "primereact/chips";

import { Row } from "@components/layout";

import "./input-multi.css";

interface InputMultiTypes {
  inputLg1: string[];
  inputLg2?: string[];
  labelLg1: string;
  labelLg2?: string;
  handleChangeLg1: (value: string[]) => void;
  handleChangeLg2?: (value: string[]) => void;
  type?: "text" | "url";
}

export const InputMulti = ({
  inputLg1,
  inputLg2,
  labelLg1,
  labelLg2,
  handleChangeLg1,
  handleChangeLg2,
}: Readonly<InputMultiTypes>) => {
  return (
    <Row className="input-multi">
      <div className={`form-group col-md-${handleChangeLg2 ? 6 : 12}`}>
        <label>
          {labelLg1}
          <Chips
            value={inputLg1}
            onChange={(e) => handleChangeLg1(e.value ?? [])}
            placeholder="Tapez une valeur et appuyez sur Entrée"
            separator=","
            allowDuplicate={false}
            addOnBlur={true}
            aria-label={`${labelLg1} - Appuyez sur Entrée ou virgule pour ajouter`}
          />
          <small className="form-text text-muted">
            Appuyez sur Entrée ou virgule pour ajouter une valeur
          </small>
        </label>
      </div>
      {!!handleChangeLg2 && (
        <div className="form-group col-md-6">
          <label>
            {labelLg2}
            <Chips
              value={inputLg2}
              onChange={(e) => handleChangeLg2(e.value ?? [])}
              placeholder="Tapez une valeur et appuyez sur Entrée"
              separator=","
              allowDuplicate={false}
              addOnBlur={true}
              aria-label={`${labelLg2} - Appuyez sur Entrée ou virgule pour ajouter`}
            />
            <small className="form-text text-muted">
              Appuyez sur Entrée ou virgule pour ajouter une valeur
            </small>
          </label>
        </div>
      )}
    </Row>
  );
};
