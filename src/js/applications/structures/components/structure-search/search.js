import { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Select from 'react-select';
import { Loading } from 'js/new-architecture/components/loading/loading';

import D from '../../i18n/build-dictionary';
import { COMPONENT_TYPES } from '../../utils/constants/dsd-components';
import api from '../../apis/structure-api';

import {
	ConceptsAPI,
	ArrayUtils,
	AdvancedSearchList,
	ItemToSelectModel,
	Stores,
	withTitle,
	useUrlQueryParameters,
} from 'js/utils';
import { useSelector } from 'react-redux';
import { Column } from '../../../../new-architecture/components/layout';
import { TextInput } from '../../../../new-architecture/components/form/input';
import { validateStateOptions } from '../../../../new-architecture/model/ValidationState';

const filterLabelLg1 = ArrayUtils.filterKeyDeburr(['labelLg1']);
const filterCreator = ArrayUtils.filterKeyDeburr(['creator']);
const filterValidationState = ArrayUtils.filterKeyDeburr(['validationState']);

const filterComponentLabelLg1 = ArrayUtils.filterKeyDeburr([
	'components.labelLg1',
]);
const filterType = ArrayUtils.filterKeyDeburr(['components.type']);
const filterConcept = ArrayUtils.filterKeyDeburr(['components.concept']);

const defaultFormState = {
	labelLg1: '',
	componentLabelLg1: '',
	type: '',
	concept: '',
	creator: '',
	validationState: '',
};

export const SearchFormList = ({ concepts, stampListOptions, data }) => {
	const [form, _setForm, reset, handleChange] =
		useUrlQueryParameters(defaultFormState);

	const {
		labelLg1,
		componentLabelLg1,
		type,
		concept,
		creator,
		validationState,
	} = form;

	const conceptsOptions = ItemToSelectModel.toSelectModel(concepts);

	const filteredData = data
		.filter(filterLabelLg1(labelLg1))
		.filter(filterComponentLabelLg1(componentLabelLg1))
		.filter(filterType(type))
		.filter(filterConcept(concept))
		.filter(filterCreator(creator))
		.filter(filterValidationState(validationState));

	const dataLinks = filteredData.map(({ id, labelLg1 }) => (
		<li key={id} className="list-group-item text-left">
			<Link to={'/structures/' + id}>{labelLg1}</Link>
		</li>
	));
	return (
		<AdvancedSearchList
			title={D.structuresSearchTitle}
			data={dataLinks}
			initializeState={reset}
			redirect={<Redirect to={'/structures'} push />}
		>
			<div className="row form-group">
				<div className="col-md-12">
					<label className="w-100">
						{D.label}
						<TextInput
							value={labelLg1}
							onChange={(e) => handleChange('labelLg1', e.target.value)}
						/>
					</label>
				</div>
			</div>
			<div className="row form-group">
				<div className="col-md-12">
					<label className="w-100">
						{D.componentLabel}
						<TextInput
							value={componentLabelLg1}
							onChange={(e) =>
								handleChange('componentLabelLg1', e.target.value)
							}
						/>
					</label>
				</div>
			</div>
			<div className="row form-group">
				<Column>
					<label className="w-100">
						{D.type}
						<Select
							placeholder=""
							value={
								COMPONENT_TYPES.find((option) => option.value === type) || ''
							}
							options={COMPONENT_TYPES}
							onChange={(option) => {
								handleChange('type', option?.value ?? '');
							}}
						/>
					</label>
				</Column>
				<Column>
					<label className="w-100">
						{D.conceptTitle}
						<Select
							placeholder=""
							value={
								conceptsOptions.find((option) => option.value === concept) || ''
							}
							options={conceptsOptions}
							onChange={(option) => {
								handleChange('concept', option?.value ?? '');
							}}
						/>
					</label>
				</Column>
			</div>
			<div className="row form-group">
				<Column>
					<label className="w-100">
						{D.creator}
						<Select
							placeholder=""
							value={
								stampListOptions.find((option) => option.value === creator) ||
								''
							}
							options={stampListOptions}
							onChange={(option) => {
								handleChange('creator', option?.value ?? '');
							}}
						/>
					</label>
				</Column>
				<Column>
					<label className="w-100">
						{D.componentValididationStatusTitle}
						<Select
							placeholder=""
							value={
								validateStateOptions.find(
									(option) => option.value === validationState
								) || ''
							}
							options={validateStateOptions}
							onChange={({ value }) => {
								handleChange('validationState', value);
							}}
						/>
					</label>
				</Column>
			</div>
		</AdvancedSearchList>
	);
};

const SearchListContainer = () => {
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [concepts, setConcepts] = useState([]);
	const stampListOptions = useSelector((state) =>
		Stores.Stamps.getStampListOptions(state)
	);

	useEffect(() => {
		Promise.all([api.getStructuresForSearch(), ConceptsAPI.getConceptList()])
			.then(([structures, concepts]) => {
				setItems(structures);
				setConcepts(concepts);
			})
			.finally(() => setLoading(false));
	}, []);
	if (loading) {
		return <Loading />;
	}

	return (
		<SearchFormList
			data={items}
			concepts={concepts}
			stampListOptions={stampListOptions}
		/>
	);
};

export default withTitle(
	SearchListContainer,
	D.structuresTitle,
	() => D.structuresAdvancedSearch
);
