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
	AbstractAdvancedSearchComponent,
	ItemToSelectModel,
	Stores,
	withTitle,
	useUrlQueryParameters,
} from 'js/utils';
import { useSelector } from 'react-redux';

const filterLabelLg1 = ArrayUtils.filterKeyDeburr(['labelLg1']);
const filterCreator = ArrayUtils.filterKeyDeburr(['creator']);
const filterValidationState = ArrayUtils.filterKeyDeburr(['validationState']);

const filterComponentLabelLg1 = ArrayUtils.filterKeyDeburr([
	'components.labelLg1',
]);
const filterType = ArrayUtils.filterKeyDeburr(['components.type']);
const filterConcept = ArrayUtils.filterKeyDeburr(['components.concept']);

const fields = [
	'labelLg1',
	'componentLabelLg1',
	'type',
	'concept',
	'creator',
	'validationState',
];

const validateStateOptions = [
	{ value: 'Unpublished', label: D.statusUnpublishedF },
	{ value: 'Modified', label: D.statusModifiedF },
	{ value: 'Validated', label: D.statusValidatedF },
];

const defaultState = {
	labelLg1: '',
	componentLabelLg1: '',
	type: '',
	concept: '',
	creator: '',
	validationState: '',
};

export class SearchFormList extends AbstractAdvancedSearchComponent {
	constructor(props) {
		super(props, {
			...defaultState,
			...props.search,
		});
	}

	handlers = this.handleChange(fields, (newState) => {
		const {
			labelLg1,
			componentLabelLg1,
			type,
			concept,
			creator,
			validationState,
		} = newState;
		this.props.setSearch({
			labelLg1,
			componentLabelLg1,
			type,
			concept,
			creator,
			validationState,
		});
	});

	render() {
		const {
			concepts,
			stampListOptions,
			data,
			reset,
			search: {
				labelLg1,
				componentLabelLg1,
				type,
				concept,
				creator,
				validationState,
			},
		} = this.props;
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
							<input
								value={labelLg1}
								onChange={(e) => this.handlers.labelLg1(e.target.value)}
								className="form-control"
							/>
						</label>
					</div>
				</div>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.componentLabel}
							<input
								value={componentLabelLg1}
								onChange={(e) =>
									this.handlers.componentLabelLg1(e.target.value)
								}
								className="form-control"
							/>
						</label>
					</div>
				</div>
				<div className="row form-group">
					<div className="col-md-6">
						<label className="w-100">
							{D.type}
							<Select
								placeholder=""
								value={
									COMPONENT_TYPES.find((option) => option.value === type) || ''
								}
								options={COMPONENT_TYPES}
								onChange={(option) => {
									this.handlers.type(option?.value ?? '');
								}}
							/>
						</label>
					</div>
					<div className="col-md-6">
						<label className="w-100">
							{D.conceptTitle}
							<Select
								placeholder=""
								value={
									conceptsOptions.find((option) => option.value === concept) ||
									''
								}
								options={conceptsOptions}
								onChange={(option) => {
									this.handlers.concept(option?.value ?? '');
								}}
							/>
						</label>
					</div>
				</div>
				<div className="row form-group">
					<div className="col-md-6">
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
									this.handlers.creator(option?.value ?? '');
								}}
							/>
						</label>
					</div>
					<div className="col-md-6">
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
									this.handlers.validationState(value);
								}}
							/>
						</label>
					</div>
				</div>
			</AdvancedSearchList>
		);
	}
}

const SearchListContainer = () => {
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [concepts, setConcepts] = useState([]);
	const stampListOptions = useSelector((state) =>
		Stores.Stamps.getStampListOptions(state)
	);
	const [search, setSearch, reset] = useUrlQueryParameters(defaultState);

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
			search={search}
			setSearch={setSearch}
			reset={reset}
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
