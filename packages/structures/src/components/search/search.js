import React, { Component } from 'react';
import { Select } from '@inseefr/wilco';
import { Link } from 'react-router-dom';

import D from '../../i18n/build-dictionary';

import {
	ArrayUtils,
	AdvancedSearchList,
	ItemToSelectModel,
} from 'bauhaus-utilities';

import './search.scss';

const filterLabel = ArrayUtils.filterKeyDeburr(['labelLg1']);
const filterConcept = ArrayUtils.filterKeyDeburr(['concept']);

const fields = ['labelLg1', 'concept'];
const sortByLabel = ArrayUtils.sortArray('labelLg1');

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
		labelLg1: '',
		concept: '',
	};

	constructor(props) {
		super(props, SearchFormList.defaultState);
	}

	handlers = this.handleChange(fields, newState => {
		const { labelLg1, concept } = newState;
		return this.props.data
			.filter(filterConcept(concept))
			.filter(filterLabel(labelLg1));
	});

	render() {
		const { data, labelLg1, concept } = this.state;
		const { concepts } = this.props;

		const conceptsOptions = ItemToSelectModel.toSelectModel(concepts);
		const dataLinks = data.map(({ id, labelLg1 }) => (
			<li key={id} className="list-group-item text-left">
				<Link to={`#`}>{labelLg1}</Link>
			</li>
		));
		return (
			<AdvancedSearchList
				title={D.componentsSearchTitle}
				data={dataLinks}
				backUrl="/dsds/components"
				initializeState={this.initializeState}
			>
				<div className="row form-group">
					<div className="col-md-12">
						<input
							value={labelLg1}
							onChange={e => this.handlers.labelLg1(e.target.value)}
							type="text"
							placeholder={D.label}
							className="form-control"
						/>
					</div>
				</div>
				<div className="row form-group">
					<div className="col-md-12">
						<label htmlFor="typeOperation" className="w-100">
							{D.conceptTitle}

							<Select
								placeholder=""
								unclearable
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
