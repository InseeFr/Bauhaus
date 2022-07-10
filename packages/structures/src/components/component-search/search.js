import React, { useState, useEffect } from 'react';
import { Select, Loading } from '@inseefr/wilco';
import { Link, Redirect } from 'react-router-dom';
import api from '../../apis/structure-api';
import D from '../../i18n/build-dictionary';
import { formatLabel } from '../../utils';
import {
	ConceptsAPI,
	ArrayUtils,
	AdvancedSearchList,
	ItemToSelectModel,
	AbstractAdvancedSearchComponent, Stores, withTitle, useUrlQueryParameters,
} from 'bauhaus-utilities';
import { useSelector } from 'react-redux';

const filterLabel = ArrayUtils.filterKeyDeburr(['labelLg1']);
const filterConcept = ArrayUtils.filterKeyDeburr(['concept']);
const filterCreator = ArrayUtils.filterKeyDeburr(['creator']);
const filterValidationState = ArrayUtils.filterKeyDeburr(['validationState']);

const fields = ['labelLg1', 'concept', 'creator', 'validationState'];

const validateStateOptions = [
	{value: 'Unpublished', label: D.statusUnpublishedM},
	{value: 'Modified', label: D.statusModifiedM},
	{value: 'Validated', label: D.statusValidatedM}
]

const defaultState = {
	labelLg1: '',
	concept: '',
	creator: '',
	validationState: ''
};

export class SearchFormList extends AbstractAdvancedSearchComponent {

	constructor(props) {
		super(props, {
			...defaultState,
			...props.search
		});
	}

	handlers = this.handleChange(fields, newState => {
		const { labelLg1, concept, creator, validationState } = newState;
		this.props.setSearch({ labelLg1, concept, creator, validationState })
	});

	render() {
		const { labelLg1, concept, creator, validationState } = this.state;
		const { concepts, stampListOptions, data } = this.props;


		const filteredData = data
			.filter(filterConcept(concept))
			.filter(filterLabel(labelLg1))
			.filter(filterCreator(creator))
			.filter(filterValidationState(validationState));

		const conceptsOptions = ItemToSelectModel.toSelectModel(concepts);
		const dataLinks = filteredData.map(component => (
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
				initializeState={this.initializeState}
				redirect={<Redirect to={'/structures/components'} push />}
			>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.label}
							<input
								value={labelLg1}
								onChange={e => this.handlers.labelLg1(e.target.value)}
								type="text"
								className="form-control"
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
									conceptsOptions.find(option => option.value === concept) || ''
								}
								options={conceptsOptions}
								onChange={value => {
									this.handlers.concept(value);
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
									stampListOptions.find(option => option.value === creator) || ''
								}
								options={stampListOptions}
								onChange={value => {
									this.handlers.creator(value);
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
									validateStateOptions.find(option => option.value === validationState) || ''
								}
								options={validateStateOptions}
								onChange={value => {
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
	const stampListOptions = useSelector(state => Stores.Stamps.getStampListOptions(state));
	const [search, setSearch] = useUrlQueryParameters(defaultState)

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
	return <SearchFormList search={search} setSearch={setSearch} data={items} concepts={concepts} stampListOptions={stampListOptions}/>;
};

export default withTitle(SearchListContainer, D.componentTitle, () => D.structuresAdvancedSearch);
