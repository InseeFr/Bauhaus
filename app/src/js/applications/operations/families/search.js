import D from 'js/i18n';
import { Link, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import { Loading } from '@inseefr/wilco';
import api from 'js/remote-api/operations-api';

import {
	ArrayUtils,
	AbstractAdvancedSearchComponent,
	AdvancedSearchList,
} from 'bauhaus-utilities';

const filterLabel = ArrayUtils.filterKeyDeburr(['prefLabelLg1']);
const fields = ['prefLabelLg1'];
const sortByLabel = ArrayUtils.sortArray('prefLabelLg1');

class SearchFormList extends AbstractAdvancedSearchComponent {
	static defaultState = {
		prefLabelLg1: '',
	};

	constructor(props) {
		super(props, SearchFormList.defaultState);
	}

	handlers = this.handleChange(fields, newState => {
		const { prefLabelLg1 } = newState;
		return this.props.data.filter(filterLabel(prefLabelLg1));
	});

	render() {
		const { data, prefLabelLg1 } = this.state;
		const dataLinks = data.map(({ id, prefLabelLg1 }) => (
			<li key={id} className="list-group-item">
				<Link to={`/operations/family/${id}`}>{prefLabelLg1}</Link>
			</li>
		));
		return (
			<AdvancedSearchList
				title={D.familiesSearchTitle}
				data={dataLinks}
				initializeState={this.initializeState}
				redirect={<Redirect to={'/operations/families'} push />}
			>
				<div className="row form-group">
					<div className="col-md-12">
						<input
							value={prefLabelLg1}
							onChange={e => this.handlers.prefLabelLg1(e.target.value)}
							type="text"
							placeholder={D.searchLabelPlaceholder}
							className="form-control"
						/>
					</div>
				</div>
			</AdvancedSearchList>
		);
	}
}
class SearchListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillMount() {
		api.getFamiliesSearchList().then(data => {
			this.setState({ data: sortByLabel(data) });
		});
	}

	render() {
		const { data } = this.state;
		if (!data) return <Loading />;
		return <SearchFormList data={data} />;
	}
}

export default SearchListContainer;
