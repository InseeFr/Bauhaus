import { Link, useNavigate } from "react-router-dom";

import { DatePicker } from "@components/date-picker";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { TextInput } from "@components/form/input";
import { NumberResults } from "@components/number-results";
import { PageTitle } from "@components/page-title";
import { Pagination } from "@components/pagination";
import { Select } from "@components/select-rmes";

import { filterKeyDate, filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import useUrlQueryParameters from "@utils/hooks/useUrlQueryParameters";

import D from "../../deprecated-locales";
import Controls from "./controls";

const filterLabel = filterKeyDeburr(["label"]);
const filterAltLabel = filterKeyDeburr(["altLabel"]);
const filterDefinition = filterKeyDeburr(["definition"]);
const filterCreator = filterKeyDeburr(["creator"]);
const filterDisseminationStatus = filterKeyDeburr(["disseminationStatus"]);
const filterValidationStatus = filterKeyDeburr(["validationStatus"]);
const filterCreatedDate = filterKeyDate(["created"]);
const filterModifiedDate = filterKeyDate(["modified"]);

const defaultFormState = {
  label: "",
  altLabel: "",
  definition: "",
  creator: "",
  dateCreatedStart: "",
  dateCreatedEnd: "",
  dateModifiedStart: "",
  dateModifiedEnd: "",
  disseminationStatus: "",
  validationStatus: "",
};

const ConceptSearchList = ({ conceptSearchList, stampList, onExport }) => {
  useTitle(D.conceptsTitle, D.advancedSearch);

  const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);
  const navigate = useNavigate();

  const {
    label,
    altLabel,
    definition,
    creator,
    disseminationStatus,
    validationStatus,
    dateCreatedStart,
    dateCreatedEnd,
    dateModifiedStart,
    dateModifiedEnd,
  } = form;

  const hits = conceptSearchList
    .filter(filterLabel(label))
    .filter(filterAltLabel(altLabel))
    .filter(filterDefinition(definition))
    .filter(filterCreator(creator))
    .filter(filterDisseminationStatus(disseminationStatus))
    .filter(filterValidationStatus(validationStatus))
    .filter(filterCreatedDate(dateCreatedStart, dateCreatedEnd))
    .filter(filterModifiedDate(dateModifiedStart, dateModifiedEnd));

  const stampListOptions = stampList.map((stamp) => {
    return {
      label: stamp,
      value: stamp,
    };
  });

  const validationStatusOptions = [
    { label: D.conceptStatusValid, value: "true" },
    { label: D.conceptStatusProvisional, value: "false" },
  ];

  const hitEls = hits.map(({ id, label }) => (
    <li key={id} className="list-group-item">
      <Link to={`/concepts/${id}`}>{label}</Link>
    </li>
  ));

  return (
    <div>
      <div className="container">
        <PageTitle title={D.conceptSearchTitle} />
        <Controls
          onClickReturn={() => navigate("/concepts")}
          initializeState={reset}
          onExport={onExport}
          conceptsList={hits}
        />
        <div className="row form-group">
          <div className="col-md-12">
            <TextInput
              value={label}
              onChange={(e) => handleChange("label", e.target.value)}
              placeholder={D.searchLabelPlaceholder}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12">
            <TextInput
              value={altLabel}
              onChange={(e) => handleChange("altLabel", e.target.value)}
              placeholder={D.searchAltLabelPlaceholder}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12">
            <TextInput
              value={definition}
              onChange={(e) => handleChange("definition", e.target.value)}
              placeholder={D.searchDefinitionPlaceholder}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-4">
            <Select
              placeholder={D.stampsPlaceholder}
              value={stampListOptions.find(({ value }) => value === creator) || ""}
              options={stampListOptions}
              onChange={(value) => handleChange("creator", value)}
            />
          </div>
          <div className="col-md-4">
            <DisseminationStatusInput
              value={disseminationStatus}
              withLabel={false}
              handleChange={(option) => handleChange("disseminationStatus", option ?? "")}
            />
          </div>
          <div className="col-md-4">
            <Select
              placeholder={D.validationStatusPlaceholder}
              value={validationStatusOptions.find(({ value }) => value === validationStatus) || ""}
              options={validationStatusOptions}
              onChange={(value) => handleChange("validationStatus", value)}
            />
          </div>
        </div>
        <div className="row vertical-center">
          <div className="col-md-3 text-center">
            <label>{D.conceptsCreationDateMessage}</label>
          </div>
          <div className="col-md-4">
            <DatePicker
              value={dateCreatedStart}
              onChange={(value) => handleChange("dateCreatedStart", value)}
              placement="bottom"
            />
          </div>
          <div className="col-md-1 text-center">
            <label>{D.conceptsTransitionDateMessage}</label>
          </div>
          <div className="col-md-4">
            <DatePicker
              value={dateCreatedEnd}
              onChange={(value) => handleChange("dateCreatedEnd", value)}
              placement="bottom"
            />
          </div>
        </div>
        <div className="row vertical-center">
          <div className="col-md-3 text-center">
            <label>{D.conceptsUpdateDateMessage}</label>
          </div>
          <div className="col-md-4">
            <DatePicker
              value={dateModifiedStart}
              onChange={(value) => handleChange("dateModifiedStart", value)}
              placement="bottom"
            />
          </div>
          <div className="col-md-1 text-center">
            <label>{D.conceptsTransitionDateMessage}</label>
          </div>
          <div className="col-md-4">
            <DatePicker
              value={dateModifiedEnd}
              onChange={(value) => handleChange("dateModifiedEnd", value)}
              placement="bottom"
            />
          </div>
        </div>
        <div className="text-center">
          <div>
            <h4>
              <NumberResults results={hitEls} />
            </h4>
          </div>
          <div>
            <Pagination itemEls={hitEls} itemsPerPage="10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptSearchList;
