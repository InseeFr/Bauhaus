import { useCallback, useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { SeeButton } from "@components/buttons/see";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { NumberInput, TextInput } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { Select } from "@components/select-rmes";
import { CreatorsInput } from "@components/business/creators-input";
import { ContributorsInput } from "@components/business/contributors-input/contributors-input";

import { CodelistsApi, StructureApi } from "@sdk/index";

import { convertToArrayIfDefined, EMPTY_ARRAY, sortArray } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import { useDefaultContributor } from "@utils/creation/use-default-contributor";

import { useAppContext } from "../../application/app-context";
import {
  IGEO_PAYS_OU_TERRITOIRE,
  MEASURE_PROPERTY_TYPE,
  MUTUALIZED_COMPONENT_TYPES,
  XSD_CODE_LIST,
  XSD_DATE,
  XSD_DATE_TIME,
  XSD_FLOAT,
  XSD_INTEGER,
  XSD_STRING,
  XSD_TYPES,
} from "../constants";
import { CodelistPanel } from "./CodelistPanel";
import { validate } from "../pages/components/edit/validation";
import "./ComponentDetailEdit.css";
import { useAuthorizationGuard } from "../../auth/components/auth";

const linkedAttributeLabelMapping = {
  [XSD_INTEGER]: i18next.t("component.representation.int.action"),
  [XSD_FLOAT]: i18next.t("component.representation.float.action"),
  [XSD_DATE]: i18next.t("component.representation.date.action"),
  [XSD_DATE_TIME]: i18next.t("component.representation.dateTime.action"),
  [XSD_STRING]: i18next.t("component.representation.string.action"),
  [IGEO_PAYS_OU_TERRITOIRE]: i18next.t("component.representation.paysOuTerritoire.action"),
  [XSD_CODE_LIST]: i18next.t("component.representation.codelist.action"),
};

const initialCodeListFormState = {
  codesFullListPanelOpened: false,
  codesPartialListPanelOpened: false,
  partials: [],
  partialCodesLists: [],
};

function codeListFormReducer(state, action) {
  switch (action.type) {
    case "SET_FULL_PANEL_OPENED":
      return { ...state, codesFullListPanelOpened: action.opened };
    case "SET_PARTIAL_PANEL_OPENED":
      return { ...state, codesPartialListPanelOpened: action.opened };
    case "SET_PARTIALS":
      return { ...state, partials: action.partials };
    case "SET_PARTIAL_CODES_LISTS":
      return { ...state, partialCodesLists: action.partialCodesLists };
    default:
      return state;
  }
}

const CodelistFormInput = ({ component, codesLists, setComponent }) => {
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(codeListFormReducer, initialCodeListFormState);

  const { codesFullListPanelOpened, codesPartialListPanelOpened, partials, partialCodesLists } =
    state;

  const fullCodeListValue = component.fullCodeListValue || component.codeList;

  const currentCodeList = component.codeList;

  useEffect(() => {
    CodelistsApi.getCodelistsPartial().then((response) => {
      dispatch({
        type: "SET_PARTIAL_CODES_LISTS",
        partialCodesLists: response,
      });
    });
  }, []);

  useEffect(() => {
    if (fullCodeListValue) {
      const fullCodeLists = [
        ...codesLists,
        ...partialCodesLists.map((l) => ({
          id: l.uri,
          label: l.labelLg1,
          notation: l.id,
        })),
      ];
      const list = fullCodeLists.find((list) => list.id === fullCodeListValue);
      if (list) {
        CodelistsApi.getPartialsByParent(list.notation).then((partials) =>
          dispatch({ type: "SET_PARTIALS", partials }),
        );
      }
    }
  }, [fullCodeListValue, codesLists, partialCodesLists]);

  const codeListOptions = codesLists.map(({ id, label }) => ({
    value: id,
    label,
  }));

  const partialsOptions = partials?.map(({ iri, labelLg1 }) => ({
    value: iri,
    label: labelLg1,
  }));

  return (
    <>
      <Row>
        <div className="col-md-offset-2 col-md-10 form-group code-list-zone">
          <label>{t("codelist")}</label>
          <Select
            placeholder={t("codelist")}
            options={codeListOptions}
            value={codeListOptions.find(
              (c) => fullCodeListValue?.toString() === c.value?.toString(),
            )}
            onChange={(value) =>
              setComponent({
                ...component,
                fullCodeListValue: value,
                codeList: undefined,
              })
            }
          />
          <SeeButton
            disabled={!fullCodeListValue}
            onClick={() => dispatch({ type: "SET_FULL_PANEL_OPENED", opened: true })}
          ></SeeButton>
        </div>
      </Row>
      {partials.length > 0 && (
        <Row>
          <div className="col-md-offset-2 col-md-10 form-group code-list-zone">
            <label>{t("partialCodelist")}</label>
            <Select
              placeholder={t("partialCodelist")}
              options={partialsOptions}
              value={partialsOptions.find(
                (c) => currentCodeList?.toString() === c.value?.toString(),
              )}
              onChange={(value) => setComponent({ ...component, codeList: value })}
            />
            <SeeButton
              disabled={!currentCodeList}
              onClick={() => dispatch({ type: "SET_PARTIAL_PANEL_OPENED", opened: true })}
            ></SeeButton>
          </div>
        </Row>
      )}
      <CodelistPanel
        codesList={codesLists.find(
          (c) => (fullCodeListValue?.id || fullCodeListValue)?.toString() === c.id?.toString(),
        )}
        isOpen={codesFullListPanelOpened}
        handleBack={() => dispatch({ type: "SET_FULL_PANEL_OPENED", opened: false })}
      />
      <CodelistPanel
        codesList={{
          notation: partials.find((c) =>
            (currentCodeList?.id || currentCodeList)?.toString().includes(c.iri?.toString()),
          )?.id,
        }}
        isOpen={codesPartialListPanelOpened}
        handleBack={() => dispatch({ type: "SET_PARTIAL_PANEL_OPENED", opened: false })}
      />
    </>
  );
};

export const ComponentDetailEdit = ({
  component: initialComponent,
  concepts = EMPTY_ARRAY,
  codesLists = EMPTY_ARRAY,
  handleSave,
  handleBack,
  type,
  attributes,
  serverSideError,
}) => {
  const { t } = useTranslation();

  const [component, setComponent] = useState({});

  const [clientSideErrors, setClientSideErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);

  const { lg1, lg2 } = useAppContext();

  useTitle(t("component.pluralTitle"), component?.labelLg1 || t("component.creationPageTitle"));

  const isContributor = useAuthorizationGuard("STRUCTURE_COMPONENT", "CREATE");
  const defaultContributor = useDefaultContributor(isContributor);

  useEffect(() => {
    let component = { ...initialComponent };
    if (!component.id) {
      component.contributor = defaultContributor ? [defaultContributor] : [];
    } else {
      component.contributor = convertToArrayIfDefined(component.contributor);
    }
    setComponent(component);
  }, [initialComponent, defaultContributor]);

  useEffect(() => {
    if (!component.type && type) {
      setComponent({ ...initialComponent, type });
    }
  }, [type, component, initialComponent]);

  const resetErrorsMessages = () =>
    setClientSideErrors({
      ...clientSideErrors,
      errorMessage: [],
    });

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      resetErrorsMessages();
      setComponent({
        ...component,
        [name]: value,
      });
    },
    [component, clientSideErrors],
  );

  const handleSaveClick = useCallback(() => {
    const clientSideErrors = validate(component);
    if (clientSideErrors.errorMessage?.length > 0) {
      setSubmitting(true);
      setClientSideErrors(clientSideErrors);
    } else {
      setClientSideErrors({});
      handleSave(component);
    }
  }, [component, handleSave]);

  const conceptOptions = concepts.map(({ id, label }) => ({
    value: id,
    label,
  }));

  const attributesKeys = Object.keys({
    attribute_0: "",
    attributeValue_0: "",
    ...component,
  }).filter((key) => key.startsWith("attribute_"));

  if (component["attributeValue_" + (attributesKeys.length - 1)]) {
    component["attribute_" + attributesKeys.length] = "";
    component["attributeValue_" + attributesKeys.length] = "";
  }

  const onComponentTypeChange = (option) => {
    // Each time we change the type of a component, we remove all linked attributes
    const newComponentWithoutAttributes = Object.keys(component).reduce((acc, key) => {
      if (key.startsWith("attribute_") || key.startsWith("attributeValue_")) {
        return acc;
      }
      return {
        ...acc,
        [key]: component[key],
      };
    }, {});
    resetErrorsMessages();
    setComponent({ ...newComponentWithoutAttributes, type: option });
  };

  return (
    <>
      <ActionToolbar>
        <CancelButton action={handleBack} col={3} />
        <SaveButton
          disabled={clientSideErrors.errorMessage?.length > 0}
          action={handleSaveClick}
          col={3}
        />
      </ActionToolbar>
      {submitting && clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={clientSideErrors.errorMessage} />
      )}
      <ErrorBloc error={serverSideError} />
      <form>
        <Row>
          <div className="col-md-12 form-group">
            <LabelRequired htmlFor="identifiant">{t("component.notation")}</LabelRequired>
            <TextInput
              id="identifiant"
              name="identifiant"
              value={component.identifiant}
              onChange={handleChange}
              aria-invalid={!!clientSideErrors.fields?.identifiant}
              aria-describedby={clientSideErrors.fields?.identifiant ? "identifiant-error" : null}
            />
            <ClientSideError
              id="identifiant-error"
              error={clientSideErrors?.fields?.identifiant}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="col-md-6 form-group">
            <LabelRequired htmlFor="labelLg1">{t("component.label", { lng: "fr" })}</LabelRequired>
            <TextInput
              id="labelLg1"
              name="labelLg1"
              onChange={handleChange}
              value={component.labelLg1}
              aria-invalid={!!clientSideErrors.fields?.labelLg1}
              aria-describedby={clientSideErrors.fields?.labelLg1 ? "labelLg1-error" : null}
            />
            <ClientSideError
              id="labelLg1-error"
              error={clientSideErrors?.fields?.labelLg1}
            ></ClientSideError>
          </div>
          <div className="col-md-6 form-group">
            <LabelRequired htmlFor="labelLg2">{t("component.label", { lng: "en" })}</LabelRequired>
            <TextInput
              id="labelLg2"
              name="labelLg2"
              value={component.labelLg2}
              onChange={handleChange}
              aria-invalid={!!clientSideErrors.fields?.labelLg2}
              aria-describedby={clientSideErrors.fields?.labelLg2 ? "labelLg2-error" : null}
            />
            <ClientSideError
              id="labelLg2-error"
              error={clientSideErrors?.fields?.labelLg2}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="col-md-6 form-group">
            <label htmlFor="altLabelLg1">{t("component.shortName", { lng: "fr" })}</label>
            <TextInput
              id="altLabelLg1"
              name="altLabelLg1"
              onChange={handleChange}
              value={component.altLabelLg1}
            />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="altLabelLg2">{t("component.shortName", { lng: "en" })}</label>
            <TextInput
              id="altLabelLg2"
              name="altLabelLg2"
              value={component.altLabelLg2}
              onChange={handleChange}
            />
          </div>
        </Row>
        <Row>
          <div className="col-md-12 form-group">
            <LabelRequired>{t("component.type.title")}</LabelRequired>
            <Select
              placeholder={t("component.type.title")}
              value={MUTUALIZED_COMPONENT_TYPES.find((c) => c.value === component.type)}
              options={MUTUALIZED_COMPONENT_TYPES}
              onChange={onComponentTypeChange}
              isDisabled={!!component.id}
            />
            <ClientSideError
              id="type-error"
              error={clientSideErrors?.fields?.type}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="col-md-12">
            <label>{t("component.concept")}</label>
            <Select
              placeholder={t("component.concept")}
              options={conceptOptions}
              value={conceptOptions.find((c) => c.value === component.concept?.toString())}
              onChange={(value) => setComponent({ ...component, concept: value })}
            />
          </div>
        </Row>
        <Row>
          <div className="col-md-12">
            <label>{t("component.representation.title")}</label>
            <Select
              placeholder={t("component.representation.title")}
              value={XSD_TYPES.find((c) => c.value === component.range)}
              options={XSD_TYPES}
              onChange={(value) => {
                setComponent({
                  ...component,
                  range: value,
                  codeList: undefined,
                });
              }}
            />
          </div>
        </Row>
        {(component.range === XSD_DATE || component.range === XSD_DATE_TIME) && (
          <Row>
            <div className="col-md-offset-1 col-md-11 form-group">
              <label htmlFor="format">{t("component.representation.format")}</label>
              <TextInput
                value={component.pattern}
                id="pattern"
                name="pattern"
                onChange={handleChange}
              />
            </div>
          </Row>
        )}
        {(component.range === XSD_STRING ||
          component.range === XSD_INTEGER ||
          component.range === XSD_FLOAT) && (
          <>
            <Row>
              <div className="col-md-offset-1 col-md-11 form-group">
                <label htmlFor="minLength">{t("component.representation.minLength")}</label>
                <NumberInput
                  value={component.minLength}
                  id="minLength"
                  name="minLength"
                  onChange={handleChange}
                />
              </div>
            </Row>
            <Row>
              <div className="col-md-offset-1 col-md-11 form-group">
                <label htmlFor="maxLength">{t("component.representation.maxLength")}</label>
                <NumberInput
                  value={component.maxLength}
                  id="maxLength"
                  name="maxLength"
                  onChange={handleChange}
                />
              </div>
            </Row>
          </>
        )}
        {component.range === XSD_STRING && (
          <Row>
            <div className="col-md-offset-1 col-md-11 form-group">
              <label htmlFor="format">{t("component.representation.format")}</label>
              <TextInput
                value={component.pattern}
                id="pattern"
                name="pattern"
                onChange={handleChange}
              />
            </div>
          </Row>
        )}
        {(component.range === XSD_INTEGER || component.range === XSD_FLOAT) && (
          <>
            <Row>
              <div className="col-md-offset-1 col-md-11 form-group">
                <label htmlFor="minInclusive">{t("component.representation.minValue")}</label>
                <NumberInput
                  value={component.minInclusive}
                  id="minInclusive"
                  name="minInclusive"
                  onChange={handleChange}
                />
              </div>
            </Row>
            <Row>
              <div className="col-md-offset-1 col-md-11 form-group">
                <label htmlFor="maxInclusive">{t("component.representation.maxValue")}</label>
                <NumberInput
                  value={component.maxInclusive}
                  id="maxInclusive"
                  name="maxInclusive"
                  onChange={handleChange}
                />
              </div>
            </Row>
          </>
        )}
        {component.range === XSD_CODE_LIST && (
          <CodelistFormInput
            component={component}
            codesLists={codesLists}
            setComponent={setComponent}
          />
        )}
        <div className="form-group">
          <CreatorsInput
            value={component.creator}
            onChange={(value) => setComponent({ ...component, creator: value })}
            mode="organisation"
          />
        </div>
        <div className="form-group">
          <ContributorsInput
            value={component.contributor}
            onChange={(values) =>
              setComponent({
                ...component,
                contributor: values,
              })
            }
            multi={true}
            mode="organisation"
          />
        </div>
        <div className="form-group">
          <DisseminationStatusInput
            value={component.disseminationStatus}
            handleChange={(value) => setComponent({ ...component, disseminationStatus: value })}
          />
        </div>
        <Row>
          <div className="col-md-6 form-group">
            <label htmlFor="descriptionLg2">
              {t("component.description", { lng: "fr" })} ({lg1})
            </label>
            <TextInput
              value={component.descriptionLg1}
              id="descriptionLg1"
              name="descriptionLg1"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="descriptionLg2">
              {t("component.description", { lng: "en" })} ({lg2})
            </label>
            <TextInput
              value={component.descriptionLg2}
              id="descriptionLg2"
              name="descriptionLg2"
              onChange={handleChange}
            />
          </div>
        </Row>
        {component.type === MEASURE_PROPERTY_TYPE && (
          <AttributesArray
            onChange={(value) => {
              const newComponent = { ...component, ...value };
              setComponent({ ...newComponent });
            }}
            component={component}
            attributes={attributes}
            codesLists={codesLists}
          />
        )}
      </form>
    </>
  );
};

const AttributesArray = ({ onChange, component, attributes, codesLists }) => {
  const { t } = useTranslation();

  const componentAttributes = Object.keys({
    attribute_0: "",
    attributeValue_0: "",
    ...component,
  }).filter((key) => key.startsWith("attribute_"));

  const attributesListOptions = (attributes ?? []).map((c) => ({
    value: c.iri,
    label: c.labelLg1,
  }));

  return componentAttributes.map((attribute, index) => {
    const attributeId = (attributes ?? []).find(
      (a) => a.iri === component["attribute_" + index],
    )?.id;

    return (
      <Row key={index}>
        <div className="col-md-6 form-group">
          <label htmlFor="attribute">{t("component.type.attribute.title")}</label>
          <Select
            placeholder={t("component.type.attribute.title")}
            value={attributesListOptions.find(
              ({ value }) => value === component["attribute_" + index],
            )}
            options={attributesListOptions}
            onChange={(value) => onChange({ ["attribute_" + index]: value })}
            searchable={true}
          />
        </div>
        {!!component["attribute_" + index] && (
          <AttributeValue
            onChange={(value) => onChange({ ["attributeValue_" + index]: value })}
            value={component["attributeValue_" + index]}
            selectedAttribute={component["attribute_" + index]}
            codesLists={codesLists}
            attributeId={attributeId}
          />
        )}
      </Row>
    );
  });
};

const AttributeTextValue = ({ onChange, value, label }) => {
  const { t } = useTranslation();

  return (
    <div className="col-md-6 form-group">
      <label htmlFor="attributeValue">{label ?? t("component.type.attribute.value")}</label>
      <TextInput
        value={value}
        id="attributeValue"
        name="attributeValue"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

const sortByLabel = sortArray("label");

const AttributeCodeList = ({ onChange, value, codeListIri, codesLists, label }) => {
  const { t } = useTranslation();

  const [codes, setCodes] = useState();

  const codeListNotation = codesLists.find((cl) => cl.id === codeListIri)?.notation;

  useEffect(() => {
    CodelistsApi.getCodesListCodes(codeListNotation, 1, 0).then((codes) => setCodes(codes));
  }, [codeListNotation]);

  if (!codes) {
    return null;
  }

  const codesOptions = sortByLabel(
    codes?.codes?.map((code) => ({ value: code.iri, label: code.labelLg1 })),
  );

  return (
    <div className="col-md-6 form-group">
      <label htmlFor="attributeValue">{label ?? t("component.type.attribute.value")}</label>
      <Select
        placeholder={t("component.type.attribute.value")}
        value={codesOptions.find((option) => option.value === value)}
        options={codesOptions}
        onChange={onChange}
        searchable={true}
      />
    </div>
  );
};

const AttributeValue = ({ onChange, value, codesLists, attributeId }) => {
  const [attribute, setAttribute] = useState();

  useEffect(() => {
    StructureApi.getMutualizedComponent(attributeId).then((body) => setAttribute(body));
  }, [attributeId]);

  if (!attribute) {
    return null;
  }

  if (attribute.range === XSD_CODE_LIST) {
    return (
      <AttributeCodeList
        label={linkedAttributeLabelMapping[attribute.range]}
        onChange={onChange}
        value={value}
        codeListIri={attribute.codeList}
        codesLists={codesLists}
      />
    );
  }

  return (
    <AttributeTextValue
      label={linkedAttributeLabelMapping[attribute.range]}
      onChange={onChange}
      value={value}
    />
  );
};
