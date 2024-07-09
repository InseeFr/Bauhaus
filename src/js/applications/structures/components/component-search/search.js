import { useState, useEffect } from 'react';
import Select from 'react-select';

import { Loading } from 'js/new-architecture/components/loading/loading';

import { Link, Redirect } from 'react-router-dom';
import api from '../../apis/structure-api';
import D from '../../i18n/build-dictionary';
import { formatLabel } from '../../utils';
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

const filterLabel = ArrayUtils.filterKeyDeburr(['labelLg1']);
const filterConcept = ArrayUtils.filterKeyDeburr(['concept']);
const filterCreator = ArrayUtils.filterKeyDeburr(['creator']);
const filterValidationState = ArrayUtils.filterKeyDeburr(['validationState']);

const validateStateOptions = [
	{ value: 'Unpublished', label: D.statusUnpublishedM },
	{ value: 'Modified', label: D.statusModifiedM },
	{ value: 'Validated', label: D.statusValidatedM },
];

const defaultFormState = {
	labelLg1: '',
	concept: '',
	creator: '',
	validationState: '',
};

export const SearchFormList = ({ concepts, stampListOptions, data }) => {
	const [form, _setForm, reset, handleChange] =
		useUrlQueryParameters(defaultFormState);

	const { labelLg1, concept, creator, validationState } = form;

	const filteredData = data
		.filter(filterConcept(concept))
		.filter(filterLabel(labelLg1))
		.filter(filterCreator(creator))
		.filter(filterValidationState(validationState));

	const conceptsOptions = ItemToSelectModel.toSelectModel(concepts);
	const dataLinks = filteredData.map((component) => (
		<li key={component.id} className="list-group-item text-left">
			<Link to={`/structures/components/${component.id}`}>
				{formatLabel(component)}
			</Link>
		</li>
	));
	return (
		<AdvancedSearchList
			title={D.componentsSearchTitle}
			data={dataLinks}
			initializeState={reset}
			redirect={<Redirect to={'/structures/components'} push />}
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
				</div>
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
							onChange={(option) => {
								handleChange('validationState', option?.value ?? '');
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
		Promise.all([
			api.getMutualizedComponentsForSearch(),
			ConceptsAPI.getConceptList(),
		])
			.then(([components, concepts]) => {
				setItems(components);
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
	D.componentTitle,
	() => D.structuresAdvancedSearch
);
