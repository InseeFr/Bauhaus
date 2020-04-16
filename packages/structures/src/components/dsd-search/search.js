import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import D from '../../i18n/build-dictionary';

import { ArrayUtils, AdvancedSearchList } from 'bauhaus-utilities';

import './search.scss';

const filterLabel = ArrayUtils.filterKeyDeburr(['label']);

const fields = ['label'];
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
	};

	constructor(props) {
		super(props, SearchFormList.defaultState);
	}

	handlers = this.handleChange(fields, newState => {
		const { label } = newState;
		return this.props.data.filter(filterLabel(label));
	});

	render() {
		const { data, label } = this.state;

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
				redirect={<Redirect to={'/dsds'} push />}
			>
				<div className="row form-group">
					<div className="col-md-12">
						<input
							value={label}
							onChange={e => this.handlers.label(e.target.value)}
							type="text"
							placeholder={D.label}
							className="form-control"
						/>
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
