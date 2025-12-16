import { BOTH, DOCUMENT, LINK } from "../../modules-operations/document/utils";
import "./filter-toggle-buttons.css";

interface FilterToggleButtonsTypes {
  options: [typeof BOTH | typeof DOCUMENT | typeof LINK, string][];
  currentValue: string;
  handleSelection: (value: typeof BOTH | typeof DOCUMENT | typeof LINK) => void;
}

const FilterToggleButtons = ({
  options,
  currentValue,
  handleSelection,
}: Readonly<FilterToggleButtonsTypes>) => {
  return (
    <div className="bauhaus-filter-toggle-buttons btn-group btn-group-justified" role="group">
      {options.map(([value, title]) => {
        return (
          <div className="btn-group" role="group" key={value}>
            <button
              type="button"
              className={`btn btn-default ${
                currentValue === value ? "bauhaus-filter-toggle-buttons-btn-active" : ""
              }`}
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

export default FilterToggleButtons;
