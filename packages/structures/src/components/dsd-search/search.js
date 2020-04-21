import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Select } from '@inseefr/wilco';
import D from '../../i18n/build-dictionary';
import { COMPONENT_TYPES } from '../../utils/constants/dsd-components';

import { ArrayUtils, AdvancedSearchList } from 'bauhaus-utilities';

import './search.scss';

const filterLabel = ArrayUtils.filterKeyDeburr(['label']);
const filterComponentLabel = ArrayUtils.filterKeyDeburr(['components.label']);
const filterType = ArrayUtils.filterKeyDeburr(['components.type']);
const filterConcept = ArrayUtils.filterKeyDeburr(['components.concept']);

const fields = ['label', 'componentLabel', 'type', 'concept'];
const sortByLabel = ArrayUtils.sortArray('label');

const handleFieldChange = (fields, handleChange) =>
	fields.reduce((handlers, field) => {
		handlers[field] = value => handleChange({ [field]: value });
		return handlers;
	}, {});

/**
 *  TODO
 * Cette classe sera supprimée. NOus utiliserons celel de bauhaus-utlities
 * J'ai du la copier/coller ici car j'avais un pb avec le storybook
 * */

export class AbstractAdvancedSearchComponent extends Component {
	constructor(props, emptyState) {
		super(props);
		this.emptyState = emptyState;
		this.state = {
			askForReturn: false,
			...this.getEmptyState(),
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.data) {
			this.setState({
				...nextProps.data,
			});
		}
	}

	getEmptyState = () => {
		return {
			...this.props,
			...this.emptyState,
		};
	};
	initializeState = () => this.setState(this.getEmptyState());
	handleChange = (fields, filterData) =>
		handleFieldChange(fields, stateChange => {
			const newState = Object.assign(this.state, stateChange);
			const data = filterData(newState);
			this.setState(Object.assign(stateChange, { data }));
		});
}

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
								unclearable
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
							<input
								value={concept}
								onChange={e => this.handlers.concept(e.target.value)}
								type="text"
								className="form-control"
							/>
						</label>
					</div>
				</div>
			</AdvancedSearchList>
		);
	}
}

/*
class SearchListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		api.getComponentsSearchList().then(data => {
			this.setState({ data: sortByLabel(data) });
		});
	}

	render() {
		const { data } = this.state;
		const { concepts } = this.props;

		if (!data) return <Loading />;
		return <SearchFormList data={data} concepts={concepts} />;
	}
}

const mapStateToProps = state => {
	return {
		concepts: state.concepts,
	};
};

export default connect(mapStateToProps)(SearchListContainer);
*/
