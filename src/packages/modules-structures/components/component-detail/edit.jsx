import { useCallback, useEffect, useState } from 'react';
import {
	ClientSideError,
	ContributorsInput,
	DisseminationStatusInput,
	ErrorBloc,
	GlobalClientSideErrorBloc,
	NumberInput,
	Row,
	SeeButton,
	TextInput,
} from '../../../components';
import { Select } from '../../../components/select-rmes';
import { API } from '../../../modules-codelists/apis';
import { CodeListApi, StructureApi } from '../../../sdk';
import { convertToArrayIfDefined, sortArray } from '../../../utils/array-utils';
import D, { D1, D2 } from '../../i18n/build-dictionary';
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
} from '../../utils/constants';
import { CodesListPanel } from '../codes-list-panel/codes-list-panel';
import { validate } from '../edition/validation';
import './edit.scss';

import { useAppContext } from '../../../application/app-context';
import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { ActionToolbar } from '../../../components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '../../../components/buttons/buttons-with-icons';
import LabelRequired from '../../../components/label-required';
import { usePermission } from '../../../redux/hooks/usePermission';
import { useTitle } from '../../../utils/hooks/useTitle';

const linkedAttributeLabelMapping = {
	[XSD_INTEGER]: D.insertIntValue,
	[XSD_FLOAT]: D.insertFloatValue,
	[XSD_DATE]: D.insertDateValue,
	[XSD_DATE_TIME]: D.insertDateValue,
	[XSD_STRING]: D.insertTextValue,
	[IGEO_PAYS_OU_TERRITOIRE]: D.insertGeographyValue,
	[XSD_CODE_LIST]: D.insertModalityValue,
};

const CodeListFormInput = ({ component, codesLists, setComponent }) => {
	const [codesFullListPanelOpened, setFullCodesListPanelOpened] =
		useState(false);
	const [codesPartialListPanelOpened, setPartialCodesListPanelOpened] =
		useState(false);
	const [partials, setPartials] = useState([]);
	const fullCodeListValue = component.fullCodeListValue || component.codeList;
	const currentCodeList = component.codeList;

	const [partialCodesLists, setPartialCodesLists] = useState([]);

	useEffect(() => {
		API.getCodelistsPartial().then((response) => {
			setPartialCodesLists(response);
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
				API.getPartialsByParent(list.notation).then((partials) =>
					setPartials(partials),
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
					<label>{D1.codesListTitle}</label>
					<Select
						placeholder={D1.codesListTitle}
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
						onClick={() => setFullCodesListPanelOpened(true)}
					></SeeButton>
				</div>
			</Row>
			{partials.length > 0 && (
				<Row>
					<div className="col-md-offset-2 col-md-10 form-group code-list-zone">
						<label>{D1.codelistsPartialTitle}</label>
						<Select
							placeholder={D1.codelistsPartialTitle}
							options={partialsOptions}
							value={partialsOptions.find(
								(c) => currentCodeList?.toString() === c.value?.toString(),
							)}
							onChange={(value) =>
								setComponent({ ...component, codeList: value })
							}
						/>
						<SeeButton
							disabled={!currentCodeList}
							onClick={() => setPartialCodesListPanelOpened(true)}
						></SeeButton>
					</div>
				</Row>
			)}
			<CodesListPanel
				codesList={codesLists.find(
					(c) =>
						(fullCodeListValue?.id || fullCodeListValue)?.toString() ===
						c.id?.toString(),
				)}
				isOpen={codesFullListPanelOpened}
				handleBack={() => setFullCodesListPanelOpened(false)}
			/>
			<CodesListPanel
				codesList={{
					notation: partials.find((c) =>
						(currentCodeList?.id || currentCodeList)
							?.toString()
							.includes(c.iri?.toString()),
					)?.id,
				}}
				isOpen={codesPartialListPanelOpened}
				handleBack={() => setPartialCodesListPanelOpened(false)}
			/>
		</>
	);
};

export const DumbComponentDetailEdit = ({
	component: initialComponent,
	concepts = [],
	codesLists = [],
	handleSave,
	handleBack,
	type,
	attributes,
	stampListOptions = [],
	serverSideError,
}) => {
	const [component, setComponent] = useState({});
	const [clientSideErrors, setClientSideErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	const { lg1, lg2 } = useAppContext();
	useTitle(D.componentTitle, component?.labelLg1);

	const permission = usePermission();
	const stamp = permission?.stamp;
	const isContributor =
		permission?.roles?.includes(STRUCTURE_CONTRIBUTOR) &&
		!permission?.roles?.includes(ADMIN);

	useEffect(() => {
		let component = { ...initialComponent };

		if (!component.id) {
			component.contributor = isContributor ? [stamp] : ['DG75-H250'];
		} else {
			component.contributor = convertToArrayIfDefined(component.contributor);
		}

		setComponent(component);
	}, [initialComponent, isContributor, stamp]);

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
		attribute_0: '',
		attributeValue_0: '',
		...component,
	}).filter((key) => key.startsWith('attribute_'));

	if (component['attributeValue_' + (attributesKeys.length - 1)]) {
		component['attribute_' + attributesKeys.length] = '';
		component['attributeValue_' + attributesKeys.length] = '';
	}

	const onComponentTypeChange = (option) => {
		// Each time we change the type of a component, we remove all linked attributes
		const newComponentWithoutAttributes = Object.keys(component).reduce(
			(acc, key) => {
				if (key.startsWith('attribute_') || key.startsWith('attributeValue_')) {
					return acc;
				}
				return {
					...acc,
					[key]: component[key],
				};
			},
			{},
		);

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
				<GlobalClientSideErrorBloc
					clientSideErrors={clientSideErrors.errorMessage}
					D={D}
				/>
			)}
			{serverSideError && <ErrorBloc error={serverSideError} D={D} />}
			<form>
				<Row>
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="identifiant">{D1.idTitle}</LabelRequired>
						<TextInput
							id="identifiant"
							name="identifiant"
							value={component.identifiant}
							onChange={handleChange}
							aria-invalid={!!clientSideErrors.fields?.identifiant}
							aria-describedby={
								clientSideErrors.fields?.identifiant
									? 'identifiant-error'
									: null
							}
						/>
						<ClientSideError
							id="identifiant-error"
							error={clientSideErrors?.fields?.identifiant}
						></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg1">
							{D1.label} ({lg1})
						</LabelRequired>
						<TextInput
							id="labelLg1"
							name="labelLg1"
							onChange={handleChange}
							value={component.labelLg1}
							aria-invalid={!!clientSideErrors.fields?.labelLg1}
							aria-describedby={
								clientSideErrors.fields?.labelLg1 ? 'labelLg1-error' : null
							}
						/>
						<ClientSideError
							id="labelLg1-error"
							error={clientSideErrors?.fields?.labelLg1}
						></ClientSideError>
					</div>

					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg2">
							{D2.label} ({lg2})
						</LabelRequired>
						<TextInput
							id="labelLg2"
							name="labelLg2"
							value={component.labelLg2}
							onChange={handleChange}
							aria-invalid={!!clientSideErrors.fields?.labelLg2}
							aria-describedby={
								clientSideErrors.fields?.labelLg2 ? 'labelLg2-error' : null
							}
						/>
						<ClientSideError
							id="labelLg2-error"
							error={clientSideErrors?.fields?.labelLg2}
						></ClientSideError>
					</div>
				</Row>

				<Row>
					<div className="col-md-6 form-group">
						<label htmlFor="altLabelLg1">
							{D1.altLabel} ({lg1})
						</label>
						<TextInput
							id="altLabelLg1"
							name="altLabelLg1"
							onChange={handleChange}
							value={component.altLabelLg1}
						/>
					</div>

					<div className="col-md-6 form-group">
						<label htmlFor="altLabelLg2">
							{D2.altLabel} ({lg2})
						</label>

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
						<LabelRequired>{D1.type}</LabelRequired>
						<Select
							placeholder={D1.type}
							value={MUTUALIZED_COMPONENT_TYPES.find(
								(c) => c.value === component.type,
							)}
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
						<label>{D1.conceptTitle}</label>
						<Select
							placeholder={D1.conceptTitle}
							options={conceptOptions}
							value={conceptOptions.find(
								(c) => c.value === component.concept?.toString(),
							)}
							onChange={(value) =>
								setComponent({ ...component, concept: value })
							}
						/>
					</div>
				</Row>
				<Row>
					<div className="col-md-12">
						<label>{D1.rangeTitle}</label>
						<Select
							placeholder={D1.rangeTitle}
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
				{(component.range === XSD_DATE ||
					component.range === XSD_DATE_TIME) && (
					<Row>
						<div className="col-md-offset-1 col-md-11 form-group">
							<label htmlFor="format">{D1.formatTitle}</label>
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
								<label htmlFor="minLength">{D1.minLength}</label>
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
								<label htmlFor="maxLength">{D1.maxLength}</label>
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
							<label htmlFor="format">{D1.formatTitle}</label>
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
								<label htmlFor="minInclusive">{D1.minInclusive}</label>
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
								<label htmlFor="maxInclusive">{D1.maxInclusive}</label>
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
					<CodeListFormInput
						component={component}
						codesLists={codesLists}
						setComponent={setComponent}
					/>
				)}
				<div className="form-group">
					<label>{D1.creatorTitle}</label>
					<Select
						placeholder={D1.stampsPlaceholder}
						value={stampListOptions.find(
							({ value }) => value === component.creator,
						)}
						options={stampListOptions}
						onChange={(value) => setComponent({ ...component, creator: value })}
						searchable={true}
					/>
				</div>
				<div className="form-group">
					<ContributorsInput
						stampListOptions={stampListOptions}
						value={component.contributor}
						handleChange={(values) =>
							setComponent({
								...component,
								contributor: values,
							})
						}
					/>
				</div>
				<div className="form-group">
					<DisseminationStatusInput
						value={component.disseminationStatus}
						handleChange={(value) =>
							setComponent({ ...component, disseminationStatus: value })
						}
					/>
				</div>
				<Row>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">
							{D1.descriptionTitle} ({lg1})
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
							{D1.descriptionTitle} ({lg2})
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
	const componentAttributes = Object.keys({
		attribute_0: '',
		attributeValue_0: '',
		...component,
	}).filter((key) => key.startsWith('attribute_'));

	const attributesListOptions = (attributes ?? []).map((c) => ({
		value: c.iri,
		label: c.labelLg1,
	}));

	return componentAttributes.map((attribute, index) => {
		const attributeId = (attributes ?? []).find(
			(a) => a.iri === component['attribute_' + index],
		)?.id;
		return (
			<Row key={index}>
				<div className="col-md-6 form-group">
					<label htmlFor="attribute">{D1.Attribute}</label>
					<Select
						placeholder={D1.attributePlaceholder}
						value={attributesListOptions.find(
							({ value }) => value === component['attribute_' + index],
						)}
						options={attributesListOptions}
						onChange={(value) => onChange({ ['attribute_' + index]: value })}
						searchable={true}
					/>
				</div>
				{!!component['attribute_' + index] && (
					<AttributeValue
						onChange={(value) =>
							onChange({ ['attributeValue_' + index]: value })
						}
						value={component['attributeValue_' + index]}
						selectedAttribute={component['attribute_' + index]}
						codesLists={codesLists}
						attributeId={attributeId}
					/>
				)}
			</Row>
		);
	});
};

const AttributeTextValue = ({ onChange, value, label }) => {
	return (
		<div className="col-md-6 form-group">
			<label htmlFor="attributeValue">{label ?? D1.Value}</label>
			<TextInput
				value={value}
				id="attributeValue"
				name="attributeValue"
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
};

const sortByLabel = sortArray('label');
const AttributeCodeList = ({
	onChange,
	value,
	codeListIri,
	codesLists,
	label,
}) => {
	const [codes, setCodes] = useState();

	const codeListNotation = codesLists.find(
		(cl) => cl.id === codeListIri,
	)?.notation;

	useEffect(() => {
		CodeListApi.getCodesListCodes(codeListNotation, 1, 0).then((codes) =>
			setCodes(codes),
		);
	}, [codeListNotation]);

	if (!codes) {
		return null;
	}

	const codesOptions = sortByLabel(
		codes?.codes?.map((code) => ({ value: code.iri, label: code.labelLg1 })),
	);

	return (
		<div className="col-md-6 form-group">
			<label htmlFor="attributeValue">{label ?? D1.Value}</label>
			<Select
				placeholder={D1.Value}
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
		StructureApi.getMutualizedComponent(attributeId).then((body) =>
			setAttribute(body),
		);
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
