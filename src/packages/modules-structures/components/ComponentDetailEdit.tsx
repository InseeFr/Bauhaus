import { useQuery } from "@tanstack/react-query";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { ContributorsInput } from "@components/business/contributors-input/contributors-input";
import { CreatorsInput } from "@components/business/creators-input";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { SeeButton } from "@components/buttons/see";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { NumberInput, TextInput } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { Select } from "@components/select-rmes";

import { Codelists } from "@model/Codelist";
import { Options } from "@model/SelectOption";
import { Component } from "@model/structures/Component";

import { toFormErrors } from "@utils/api-errors";
import { convertToArrayIfDefined, EMPTY_ARRAY, sortArray } from "@utils/array-utils";
import { useDefaultContributor } from "@utils/creation/use-default-contributor";
import { useAllCodes } from "@utils/hooks/codelist";
import { useTitle } from "@utils/hooks/useTitle";

import { useAppContext } from "../../application/app-context";
import { useAuthorizationGuard } from "../../auth/components/auth";
import { MEASURE_PROPERTY_TYPE, MUTUALIZED_COMPONENT_TYPES } from "../constants/dsd-components";
import {
  IGEO_PAYS_OU_TERRITOIRE,
  XSD_CODE_LIST,
  XSD_DATE,
  XSD_DATE_TIME,
  XSD_FLOAT,
  XSD_INTEGER,
  XSD_STRING,
  XSD_TYPES,
} from "../constants/xsd";
import {
  mutualizedComponentQuery,
  partialCodelistsQuery,
  partialsByParentQuery,
} from "../hooks/queries";
import { structuresI18n } from "../i18n";
import { validate } from "../pages/components/edit/validation";
import "./ComponentDetailEdit.css";
import { CodelistPanel } from "./CodelistPanel";

// The edited component carries, on top of the known `Component` fields, a variable number of
// dynamic `attribute_<n>` / `attributeValue_<n>` keys (one pair per linked measure attribute).
export type ComponentFormState = Partial<Component> & Record<string, any>;

type ClientSideErrors = {
  fields?: Record<string, string>;
  errorMessage?: string[];
};

/** Champs du corps (`ComponentRequest`) qui ont un emplacement d'erreur sur l'écran ;
 * les autres restent au bandeau. */
const FIELDS_WITH_ERROR_SLOT = ["identifiant", "labelLg1", "labelLg2", "type"];

const linkedAttributeLabelMapping: Record<string, string> = {
  [XSD_INTEGER]: structuresI18n.t("component.representation.int.action"),
  [XSD_FLOAT]: structuresI18n.t("component.representation.float.action"),
  [XSD_DATE]: structuresI18n.t("component.representation.date.action"),
  [XSD_DATE_TIME]: structuresI18n.t("component.representation.dateTime.action"),
  [XSD_STRING]: structuresI18n.t("component.representation.string.action"),
  [IGEO_PAYS_OU_TERRITOIRE]: structuresI18n.t("component.representation.paysOuTerritoire.action"),
  [XSD_CODE_LIST]: structuresI18n.t("component.representation.codelist.action"),
};

const XSD_TYPE_OPTIONS = [...XSD_TYPES];

interface CodelistFormState {
  codesFullListPanelOpened: boolean;
  codesPartialListPanelOpened: boolean;
}

type CodelistFormAction =
  | { type: "SET_FULL_PANEL_OPENED"; opened: boolean }
  | { type: "SET_PARTIAL_PANEL_OPENED"; opened: boolean };

const initialCodelistFormState: CodelistFormState = {
  codesFullListPanelOpened: false,
  codesPartialListPanelOpened: false,
};

function codelistFormReducer(
  state: CodelistFormState,
  action: CodelistFormAction,
): CodelistFormState {
  switch (action.type) {
    case "SET_FULL_PANEL_OPENED":
      return { ...state, codesFullListPanelOpened: action.opened };
    case "SET_PARTIAL_PANEL_OPENED":
      return { ...state, codesPartialListPanelOpened: action.opened };
    default:
      return state;
  }
}

interface CodelistFormInputTypes {
  component: ComponentFormState;
  codelists: Codelists;
  setComponent: Dispatch<SetStateAction<ComponentFormState>>;
}

const CodelistFormInput = ({
  component,
  codelists,
  setComponent,
}: Readonly<CodelistFormInputTypes>) => {
  const { t } = useTranslation();

  const [state, dispatch] = useReducer(codelistFormReducer, initialCodelistFormState);

  const { codesFullListPanelOpened, codesPartialListPanelOpened } = state;

  const fullCodelistValue = component.fullCodeListValue || component.codeList;

  const currentCodelist = component.codeList;

  const { data: partialCodelists = EMPTY_ARRAY } = useQuery(partialCodelistsQuery());

  const fullCodelistNotation = useMemo(() => {
    if (!fullCodelistValue) return undefined;
    const fullCodelists = [
      ...codelists,
      ...partialCodelists.map((l) => ({
        id: l.uri,
        label: l.labelLg1,
        notation: l.id,
      })),
    ];
    return fullCodelists.find((list) => list.id === fullCodelistValue)?.notation;
  }, [fullCodelistValue, codelists, partialCodelists]);

  const { data: partials = EMPTY_ARRAY } = useQuery({
    ...partialsByParentQuery(fullCodelistNotation!),
    enabled: !!fullCodelistNotation,
  });

  const codelistOptions = useMemo(
    () => codelists.map(({ id, label }) => ({ value: id, label })),
    [codelists],
  );

  const partialsOptions = useMemo(
    () => partials.map(({ iri, labelLg1 }) => ({ value: iri, label: labelLg1 })),
    [partials],
  );

  const handleFullCodelistChange = useCallback(
    (value: string) =>
      setComponent((previous) => ({
        ...previous,
        fullCodeListValue: value,
        codeList: undefined,
      })),
    [setComponent],
  );

  const handlePartialCodelistChange = useCallback(
    (value: string) => setComponent((previous) => ({ ...previous, codeList: value })),
    [setComponent],
  );

  const openFullPanel = useCallback(
    () => dispatch({ type: "SET_FULL_PANEL_OPENED", opened: true }),
    [],
  );
  const closeFullPanel = useCallback(
    () => dispatch({ type: "SET_FULL_PANEL_OPENED", opened: false }),
    [],
  );
  const openPartialPanel = useCallback(
    () => dispatch({ type: "SET_PARTIAL_PANEL_OPENED", opened: true }),
    [],
  );
  const closePartialPanel = useCallback(
    () => dispatch({ type: "SET_PARTIAL_PANEL_OPENED", opened: false }),
    [],
  );

  const partialCodelist = useMemo(
    () => ({
      notation: partials.find((c) =>
        ((currentCodelist as any)?.id || currentCodelist)?.toString().includes(c.iri?.toString()),
      )?.id,
    }),
    [partials, currentCodelist],
  );

  return (
    <>
      <Row>
        <div className="lg:col-offset-2 col-12 lg:col-10 bauhaus-form-group code-list-zone">
          <label>{t("codelist")}</label>
          <Select
            placeholder={t("codelist")}
            options={codelistOptions}
            value={codelistOptions.find(
              (c) => fullCodelistValue?.toString() === c.value?.toString(),
            )}
            onChange={handleFullCodelistChange}
          />
          <SeeButton {...{ disabled: !fullCodelistValue }} onClick={openFullPanel}></SeeButton>
        </div>
      </Row>
      {partials.length > 0 && (
        <Row>
          <div className="lg:col-offset-2 col-12 lg:col-10 bauhaus-form-group code-list-zone">
            <label>{t("partialCodelist")}</label>
            <Select
              placeholder={t("partialCodelist")}
              options={partialsOptions}
              value={partialsOptions.find(
                (c) => currentCodelist?.toString() === c.value?.toString(),
              )}
              onChange={handlePartialCodelistChange}
            />
            <SeeButton {...{ disabled: !currentCodelist }} onClick={openPartialPanel}></SeeButton>
          </div>
        </Row>
      )}
      <CodelistPanel
        codelist={codelists.find(
          (c) =>
            ((fullCodelistValue as any)?.id || fullCodelistValue)?.toString() === c.id?.toString(),
        )}
        isOpen={codesFullListPanelOpened}
        handleBack={closeFullPanel}
      />
      <CodelistPanel
        codelist={partialCodelist}
        isOpen={codesPartialListPanelOpened}
        handleBack={closePartialPanel}
      />
    </>
  );
};

/**
 * État initial du formulaire : contributeur normalisé (pré-rempli à la création) et type imposé
 * par la page quand la composante n'en a pas encore.
 */
const toFormState = (
  initialComponent: Partial<Component> | undefined,
  defaultContributor: string | undefined,
  type: string | undefined,
): ComponentFormState => {
  const component: ComponentFormState = { ...initialComponent };
  if (!component.id) {
    component.contributor = defaultContributor ? [defaultContributor] : [];
  } else {
    component.contributor = convertToArrayIfDefined(component.contributor as string | string[]);
  }
  if (!component.type && type) {
    component.type = type;
  }
  return component;
};

interface ComponentDetailEditTypes {
  component?: Partial<Component>;
  concepts?: any[];
  codelists?: Codelists;
  handleSave: (component: ComponentFormState) => void;
  handleBack: VoidFunction;
  type?: string;
  attributes?: Component[];
  serverSideError?: unknown;
}

export const ComponentDetailEdit = ({
  component: initialComponent,
  concepts = EMPTY_ARRAY,
  codelists = EMPTY_ARRAY,
  handleSave,
  handleBack,
  type,
  attributes,
  serverSideError,
}: Readonly<ComponentDetailEditTypes>) => {
  const { t } = useTranslation();

  // Les erreurs de champ d'un rejet du serveur deviennent les erreurs client, que le formulaire
  // renaisse avec le rejet ou reste monté pendant l'enregistrement.
  const serverErrors = useMemo(
    () => toFormErrors(serverSideError, FIELDS_WITH_ERROR_SLOT),
    [serverSideError],
  );

  const [clientSideErrors, setClientSideErrors] = useState<ClientSideErrors>(
    () => serverErrors.clientSideErrors ?? {},
  );

  const [submitting, setSubmitting] = useState(() => !!serverErrors.clientSideErrors);

  const [receivedServerErrors, setReceivedServerErrors] = useState(serverErrors);
  if (receivedServerErrors !== serverErrors) {
    setReceivedServerErrors(serverErrors);
    if (serverErrors.clientSideErrors) {
      setClientSideErrors(serverErrors.clientSideErrors);
      setSubmitting(true);
    }
  }

  const { lg1, lg2 } = useAppContext();

  const isContributor = useAuthorizationGuard({
    module: "STRUCTURE_COMPONENT",
    privilege: "CREATE",
  });

  const defaultContributor = useDefaultContributor(isContributor);

  const [component, setComponent] = useState<ComponentFormState>(() =>
    toFormState(initialComponent, defaultContributor, type),
  );

  // Composante, contributeur par défaut (résolu de façon asynchrone) ou type qui changent :
  // le formulaire repart de ces nouvelles valeurs, ajusté pendant le rendu plutôt que dans un effet.
  const [formSource, setFormSource] = useState({ initialComponent, defaultContributor, type });
  if (
    formSource.initialComponent !== initialComponent ||
    formSource.defaultContributor !== defaultContributor ||
    formSource.type !== type
  ) {
    setFormSource({ initialComponent, defaultContributor, type });
    setComponent(toFormState(initialComponent, defaultContributor, type));
  }

  useTitle(t("component.pluralTitle"), component?.labelLg1 || t("component.creationPageTitle"));

  // Une tentative d'enregistrement a échoué à la validation : chaque saisie revalide le formulaire.
  const [saveAttempted, setSaveAttempted] = useState(false);

  const updateErrorsFor = useCallback(
    (component: ComponentFormState) =>
      setClientSideErrors(
        saveAttempted ? validate(component) : { ...clientSideErrors, errorMessage: [] },
      ),
    [clientSideErrors, saveAttempted],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newComponent = {
        ...component,
        [name]: value,
      };
      updateErrorsFor(newComponent);
      setComponent(newComponent);
    },
    [component, updateErrorsFor],
  );

  const handleSaveClick = useCallback(() => {
    const clientSideErrors = validate(component);
    if (clientSideErrors.errorMessage?.length > 0) {
      setSubmitting(true);
      setSaveAttempted(true);
      setClientSideErrors(clientSideErrors);
    } else {
      setClientSideErrors({});
      handleSave(component);
    }
  }, [component, handleSave]);

  const conceptOptions = useMemo(
    () => concepts.map(({ id, label }: any) => ({ value: id, label })),
    [concepts],
  );

  const handleConceptChange = useCallback(
    (value: string) => setComponent((previous) => ({ ...previous, concept: value })),
    [],
  );

  const handleRangeChange = useCallback(
    (value: string) =>
      setComponent((previous) => ({ ...previous, range: value, codeList: undefined })),
    [],
  );

  const handleCreatorChange = useCallback(
    (value: unknown) => setComponent((previous) => ({ ...previous, creator: value as string })),
    [],
  );

  const handleContributorsChange = useCallback(
    (values: unknown) =>
      setComponent((previous) => ({ ...previous, contributor: values as string[] })),
    [],
  );

  const handleDisseminationStatusChange = useCallback(
    (value: string) => setComponent((previous) => ({ ...previous, disseminationStatus: value })),
    [],
  );

  const handleAttributesChange = useCallback(
    (value: Record<string, any>) => setComponent((previous) => ({ ...previous, ...value })),
    [],
  );

  const onComponentTypeChange = useCallback(
    (option: any) => {
      // Each time we change the type of a component, we remove all linked attributes
      const newComponentWithoutAttributes = Object.keys(component).reduce((acc: any, key) => {
        if (key.startsWith("attribute_") || key.startsWith("attributeValue_")) {
          return acc;
        }
        return {
          ...acc,
          [key]: component[key],
        };
      }, {});
      const newComponent = { ...newComponentWithoutAttributes, type: option };
      updateErrorsFor(newComponent);
      setComponent(newComponent);
    },
    [component, updateErrorsFor],
  );

  return (
    <>
      <ActionToolbar>
        <CancelButton action={handleBack} {...{ col: 3 }} />
        <SaveButton
          disabled={!!clientSideErrors.errorMessage?.length}
          action={handleSaveClick}
          {...{ col: 3 }}
        />
      </ActionToolbar>
      {submitting && clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={clientSideErrors.errorMessage} />
      )}
      <ErrorBloc error={serverErrors.serverSideError} />
      <form>
        <Row>
          <div className="col-12 bauhaus-form-group">
            <LabelRequired htmlFor="identifiant">{t("component.notation")}</LabelRequired>
            <TextInput
              id="identifiant"
              name="identifiant"
              value={component.identifiant}
              onChange={handleChange}
              aria-invalid={!!clientSideErrors.fields?.identifiant}
              aria-describedby={
                clientSideErrors.fields?.identifiant ? "identifiant-error" : undefined
              }
            />
            <ClientSideError
              id="identifiant-error"
              error={clientSideErrors?.fields?.identifiant}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="col-12 lg:col-6 bauhaus-form-group">
            <LabelRequired htmlFor="labelLg1">{t("component.label", { lng: "fr" })}</LabelRequired>
            <TextInput
              id="labelLg1"
              name="labelLg1"
              onChange={handleChange}
              value={component.labelLg1}
              aria-invalid={!!clientSideErrors.fields?.labelLg1}
              aria-describedby={clientSideErrors.fields?.labelLg1 ? "labelLg1-error" : undefined}
            />
            <ClientSideError
              id="labelLg1-error"
              error={clientSideErrors?.fields?.labelLg1}
            ></ClientSideError>
          </div>
          <div className="col-12 lg:col-6 bauhaus-form-group">
            <LabelRequired htmlFor="labelLg2">{t("component.label", { lng: "en" })}</LabelRequired>
            <TextInput
              id="labelLg2"
              name="labelLg2"
              value={component.labelLg2}
              onChange={handleChange}
              aria-invalid={!!clientSideErrors.fields?.labelLg2}
              aria-describedby={clientSideErrors.fields?.labelLg2 ? "labelLg2-error" : undefined}
            />
            <ClientSideError
              id="labelLg2-error"
              error={clientSideErrors?.fields?.labelLg2}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="col-12 lg:col-6 bauhaus-form-group">
            <label htmlFor="altLabelLg1">{t("component.shortName", { lng: "fr" })}</label>
            <TextInput
              id="altLabelLg1"
              name="altLabelLg1"
              onChange={handleChange}
              value={component.altLabelLg1}
            />
          </div>
          <div className="col-12 lg:col-6 bauhaus-form-group">
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
          <div className="col-12 bauhaus-form-group">
            <LabelRequired>{t("component.type.title")}</LabelRequired>
            <Select
              placeholder={t("component.type.title")}
              value={component.type}
              options={MUTUALIZED_COMPONENT_TYPES}
              onChange={onComponentTypeChange}
              {...{ isDisabled: !!component.id }}
            />
            <ClientSideError
              id="type-error"
              error={clientSideErrors?.fields?.type}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="col-12">
            <label>{t("component.concept")}</label>
            <Select
              placeholder={t("component.concept")}
              options={conceptOptions}
              value={conceptOptions.find((c) => c.value === component.concept?.toString())}
              onChange={handleConceptChange}
            />
          </div>
        </Row>
        <Row>
          <div className="col-12">
            <label>{t("component.representation.title")}</label>
            <Select
              placeholder={t("component.representation.title")}
              value={XSD_TYPES.find((c) => c.value === component.range)}
              options={XSD_TYPE_OPTIONS}
              onChange={handleRangeChange}
            />
          </div>
        </Row>
        {(component.range === XSD_DATE || component.range === XSD_DATE_TIME) && (
          <Row>
            <div className="lg:col-offset-1 col-12 lg:col-11 bauhaus-form-group">
              <label htmlFor="pattern">{t("component.representation.format")}</label>
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
              <div className="lg:col-offset-1 col-12 lg:col-11 bauhaus-form-group">
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
              <div className="lg:col-offset-1 col-12 lg:col-11 bauhaus-form-group">
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
            <div className="lg:col-offset-1 col-12 lg:col-11 bauhaus-form-group">
              <label htmlFor="pattern">{t("component.representation.format")}</label>
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
              <div className="lg:col-offset-1 col-12 lg:col-11 bauhaus-form-group">
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
              <div className="lg:col-offset-1 col-12 lg:col-11 bauhaus-form-group">
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
            codelists={codelists}
            setComponent={setComponent}
          />
        )}
        <div className="bauhaus-form-group">
          <CreatorsInput
            value={component.creator ?? ""}
            onChange={handleCreatorChange}
            mode="organization"
          />
        </div>
        <div className="bauhaus-form-group">
          <ContributorsInput
            value={component.contributor ?? EMPTY_ARRAY}
            onChange={handleContributorsChange}
            multi={true}
            mode="organization"
          />
        </div>
        <div className="bauhaus-form-group">
          <DisseminationStatusInput
            value={component.disseminationStatus ?? ""}
            handleChange={handleDisseminationStatusChange}
          />
        </div>
        <Row>
          <div className="col-12 lg:col-6 bauhaus-form-group">
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
          <div className="col-12 lg:col-6 bauhaus-form-group">
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
            onChange={handleAttributesChange}
            component={component}
            attributes={attributes}
            codelists={codelists}
          />
        )}
      </form>
    </>
  );
};

interface AttributesArrayTypes {
  onChange: (value: Record<string, any>) => void;
  component: ComponentFormState;
  attributes?: Component[];
  codelists: Codelists;
}

const AttributesArray = ({
  onChange,
  component,
  attributes,
  codelists,
}: Readonly<AttributesArrayTypes>) => {
  const filledAttributes = Object.keys({
    attribute_0: "",
    attributeValue_0: "",
    ...component,
  }).filter((key) => key.startsWith("attribute_"));

  // Once the last row has a value, an empty row is offered to link one more attribute. It is
  // only displayed: it enters the component when the user fills it in.
  const componentAttributes = component["attributeValue_" + (filledAttributes.length - 1)]
    ? [...filledAttributes, "attribute_" + filledAttributes.length]
    : filledAttributes;

  const attributesListOptions: Options = useMemo(
    () =>
      (attributes ?? EMPTY_ARRAY).map((c: Component) => ({
        value: c.iri ?? "",
        label: c.labelLg1 ?? "",
      })),
    [attributes],
  );

  return componentAttributes.map((attribute, index) => (
    <AttributeRow
      key={attribute}
      index={index}
      onChange={onChange}
      selectedAttribute={component["attribute_" + index]}
      value={component["attributeValue_" + index]}
      attributeId={
        (attributes ?? EMPTY_ARRAY).find(
          (a: Component) => a.iri === component["attribute_" + index],
        )?.id
      }
      attributesListOptions={attributesListOptions}
      codelists={codelists}
    />
  ));
};

interface AttributeRowTypes {
  index: number;
  onChange: (value: Record<string, any>) => void;
  selectedAttribute?: string;
  value?: string;
  attributeId?: string;
  attributesListOptions: Options;
  codelists: Codelists;
}

/** Une ligne « attribut lié + valeur » d'une mesure. */
const AttributeRow = ({
  index,
  onChange,
  selectedAttribute,
  value,
  attributeId,
  attributesListOptions,
  codelists,
}: Readonly<AttributeRowTypes>) => {
  const { t } = useTranslation();

  const handleAttributeChange = useCallback(
    (attribute: string) => onChange({ ["attribute_" + index]: attribute }),
    [onChange, index],
  );

  const handleValueChange = useCallback(
    (attributeValue: string) => onChange({ ["attributeValue_" + index]: attributeValue }),
    [onChange, index],
  );

  return (
    <Row>
      <div className="col-12 lg:col-6 bauhaus-form-group">
        <label htmlFor="attribute">{t("component.type.attribute.title")}</label>
        <Select
          placeholder={t("component.type.attribute.title")}
          value={attributesListOptions.find((option) => option.value === selectedAttribute)}
          options={attributesListOptions}
          onChange={handleAttributeChange}
        />
      </div>
      {!!selectedAttribute && (
        <AttributeValue
          onChange={handleValueChange}
          value={value}
          selectedAttribute={selectedAttribute}
          codelists={codelists}
          attributeId={attributeId}
        />
      )}
    </Row>
  );
};

interface AttributeTextValueTypes {
  onChange: (value: string) => void;
  value?: string;
  label?: string;
}

const AttributeTextValue = ({ onChange, value, label }: Readonly<AttributeTextValueTypes>) => {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange],
  );

  return (
    <div className="col-12 lg:col-6 bauhaus-form-group">
      <label htmlFor="attributeValue">{label ?? t("component.type.attribute.value")}</label>
      <TextInput value={value} id="attributeValue" name="attributeValue" onChange={handleChange} />
    </div>
  );
};

const sortByLabel = sortArray("label");

interface AttributeCodelistTypes {
  onChange: (value: string) => void;
  value?: string;
  codelistIri?: string;
  codelists: Codelists;
  label?: string;
}

const AttributeCodelist = ({
  onChange,
  value,
  codelistIri,
  codelists,
  label,
}: Readonly<AttributeCodelistTypes>) => {
  const { t } = useTranslation();

  const codelistNotation = codelists.find((cl) => cl.id === codelistIri)?.notation;

  const { data: codes } = useAllCodes(codelistNotation, true);

  if (!codes) {
    return null;
  }

  const codesOptions: Options = sortByLabel(
    codes.map((code) => ({ value: code.iri, label: code.labelLg1 })),
  );

  return (
    <div className="col-12 lg:col-6 bauhaus-form-group">
      <label htmlFor="attributeValue">{label ?? t("component.type.attribute.value")}</label>
      <Select
        placeholder={t("component.type.attribute.value")}
        value={codesOptions.find((option) => option.value === value)}
        options={codesOptions}
        onChange={onChange}
      />
    </div>
  );
};

interface AttributeValueTypes {
  onChange: (value: string) => void;
  value?: string;
  selectedAttribute?: string;
  codelists: Codelists;
  attributeId?: string;
}

const AttributeValue = ({
  onChange,
  value,
  codelists,
  attributeId,
}: Readonly<AttributeValueTypes>) => {
  const { data: attribute } = useQuery({
    ...mutualizedComponentQuery(attributeId!),
    enabled: !!attributeId,
  });

  if (!attribute) {
    return null;
  }

  if (attribute.range === XSD_CODE_LIST) {
    return (
      <AttributeCodelist
        label={linkedAttributeLabelMapping[attribute.range]}
        onChange={onChange}
        value={value}
        codelistIri={attribute.codeList}
        codelists={codelists}
      />
    );
  }

  return (
    <AttributeTextValue
      label={linkedAttributeLabelMapping[attribute.range ?? ""]}
      onChange={onChange}
      value={value}
    />
  );
};
