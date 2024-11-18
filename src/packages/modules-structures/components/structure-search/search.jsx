import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { AdvancedSearchList } from '@components/advanced-search/home';
import { TextInput } from '@components/form/input';
import { Column } from '@components/layout';
import { Loading } from '@components/loading';
import { Select } from '@components/select-rmes';

import { filterKeyDeburr } from '@utils/array-utils';
import { useStampsOptions } from '@utils/hooks/stamps';
import { useTitle } from '@utils/hooks/useTitle';
import useUrlQueryParameters from '@utils/hooks/useUrlQueryParameters';
import * as ItemToSelectModel from '@utils/item-to-select-model';

import { validateStateOptions } from '../../../model/ValidationState';
import { ConceptsApi, StructureApi } from '../../../sdk';
import D from '../../i18n/build-dictionary';
import { COMPONENT_TYPES } from '../../utils/constants';

const filterLabelLg1 = filterKeyDeburr(['labelLg1']);
const filterCreator = filterKeyDeburr(['creator']);
const filterValidationState = filterKeyDeburr(['validationState']);

const filterComponentLabelLg1 = filterKeyDeburr(['components.labelLg1']);
const filterType = filterKeyDeburr(['components.type']);
const filterConcept = filterKeyDeburr(['components.concept']);

const defaultFormState = {
	labelLg1: '',
	componentLabelLg1: '',
	type: '',
	concept: '',
	creator: '',
	validationState: '',
};

export const SearchFormList = ({ concepts, stampListOptions, data }) => {
	const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);

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
			redirect={<Navigate to="/structures" />}
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
							onChange={(value) => {
								handleChange('type', value);
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
							onChange={(value) => {
								handleChange('concept', value);
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
							onChange={(value) => {
								handleChange('creator', value);
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
									(option) => option.value === validationState,
								) || ''
							}
							options={validateStateOptions}
							onChange={(value) => {
								handleChange('validationState', value);
							}}
						/>
					</label>
				</Column>
			</div>
		</AdvancedSearchList>
	);
};

export const Component = () => {
	useTitle(D.structuresTitle, D.structuresAdvancedSearch);

	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [concepts, setConcepts] = useState([]);
	const stampListOptions = useStampsOptions();

	useEffect(() => {
		Promise.all([
			StructureApi.getStructuresForSearch(),
			ConceptsApi.getConceptList(),
		])
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
