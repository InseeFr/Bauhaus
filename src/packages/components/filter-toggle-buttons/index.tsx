import { cx } from "@utils/cx";

import "./filter-toggle-buttons.css";
import { BOTH, DOCUMENT, LINK } from "../../constants/documentType";

interface FilterToggleButtonsTypes {
  options: [typeof BOTH | typeof DOCUMENT | typeof LINK, string][];
  currentValue: string;
  handleSelection: (value: typeof BOTH | typeof DOCUMENT | typeof LINK) => void;
}

export const FilterToggleButtons = ({
  options,
  currentValue,
  handleSelection,
}: Readonly<FilterToggleButtonsTypes>) => {
  return (
    <div className="bauhaus-filter-toggle-buttons" role="group">
      {options.map(([value, title]) => {
        return (
          <div className="bauhaus-filter-toggle-buttons-segment" key={value}>
            <button
              type="button"
              className={cx(
                "bauhaus-filter-toggle-buttons-btn",
                currentValue === value && "bauhaus-filter-toggle-buttons-btn-active",
              )}
              onClick={() => handleSelection(value)}
            >
              {title}
            </button>
          </div>
        );
      })}
    </div>
  );
};
