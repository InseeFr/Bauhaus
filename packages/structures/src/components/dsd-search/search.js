import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Select, Loading } from '@inseefr/wilco';
import D from '../../i18n/build-dictionary';
import { COMPONENT_TYPES } from '../../utils/constants/dsd-components';
import api from '../../apis/structure-api';

import {
	ConceptsAPI,
	ArrayUtils,
	AdvancedSearchList,
	AbstractAdvancedSearchComponent,
	ItemToSelectModel,
} from 'bauhaus-utilities';

const filterLabel = ArrayUtils.filterKeyDeburr(['label']);
const filterComponentLabel = ArrayUtils.filterKeyDeburr(['components.label']);
const filterType = ArrayUtils.filterKeyDeburr(['components.type']);
const filterConcept = ArrayUtils.filterKeyDeburr(['components.concept']);

const fields = ['label', 'componentLabel', 'type', 'concept'];

export class SearchFormList extends AbstractAdvancedSearchComponent {
	static defaultState = {
		label: '',
		componentLabel: '',
		type: '',
		concept: '',
	};

	constructor(props) {
		super(props, SearchFormList.defaultState);
	}

	handlers = this.handleChange(fields, newState => {
		const { label, componentLabel, type, concept } = newState;
		return this.props.data
			.filter(filterLabel(label))
			.filter(filterComponentLabel(componentLabel))
			.filter(filterType(type))
			.filter(filterConcept(concept));
	});

	render() {
		const { data, label, componentLabel, type, concept } = this.state;
		const { concepts } = this.props;
		const conceptsOptions = ItemToSelectModel.toSelectModel(concepts);

		const dataLinks = data.map(({ id, label }) => (
			<li key={id} className="list-group-item text-left">
				<Link to={`#`}>{label}</Link>
			</li>
		));
		return (
			<AdvancedSearchList
				title={D.structuresSearchTitle}
				data={dataLinks}
				initializeState={this.initializeState}
				redirect={<Redirect to={'/structures'} push />}
			>
				<div className="row form-group">
					<div className="col-md-6">
						<label className="w-100">
							{D.label}
							<input
								value={label}
								onChange={e => this.handlers.label(e.target.value)}
								type="text"
								className="form-control"
							/>
						</label>
					</div>
					<div className="col-md-6">
						<label className="w-100">
							{D.componentLabel}
							<input
								value={componentLabel}
								onChange={e => this.handlers.componentLabel(e.target.value)}
								type="text"
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
								value={COMPONENT_TYPES.find(option => option.value === type)}
								options={COMPONENT_TYPES}
								onChange={value => {
									this.handlers.type(value);
								}}
							/>
						</label>
					</div>
					<div className="col-md-6">
						<label className="w-100">
							{D.conceptTitle}
							<Select
								placeholder=""
								value={conceptsOptions.find(option => option.value === concept)}
								options={conceptsOptions}
								onChange={value => {
									this.handlers.concept(value);
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

	useEffect(() => {
		Promise.all([api.getStructuresForSearch(), ConceptsAPI.getConceptList()])
			.then(([components, concepts]) => {
				setItems(ArrayUtils.sortArrayByLabel(components));
				setConcepts(concepts);
			})
			.finally(() => setLoading(false));
	}, []);
	if (loading) {
		return <Loading />;
	}
	return <SearchFormList data={items} concepts={concepts} />;
};

export default SearchListContainer;
