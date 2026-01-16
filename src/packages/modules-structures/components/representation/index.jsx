import D from "../../i18n/build-dictionary";
import { XSD_TYPES } from "../../utils/constants";
import "./index.css";

const Representation = ({ component, codesLists, handleCodesListDetail }) => {
  const codeList = codesLists.find(
    ({ id }) => id?.toString() === component.codeList?.toString(),
  )?.label;

  if (codeList) {
    return (
      <div className="representation">
        <span>{codeList}</span>
        <button
          type="button"
          className="btn btn-default"
          onClick={handleCodesListDetail}
          aria-label={D.seeCodesListDetails}
          title={D.seeCodesListDetails}
        >
          <span className="glyphicon glyphicon-th"></span>
        </button>
      </div>
    );
  }

  return XSD_TYPES.find((range) => component.range === range.value)?.label || "";
};

export default Representation;
