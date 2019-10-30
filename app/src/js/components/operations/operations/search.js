import D from 'js/i18n';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Loading } from 'bauhaus-library';
import { AbstractSearchComponent } from 'js/components/shared/advanced-search/home-container';
import api from 'js/remote-api/operations-api';

import { filterKeyDeburr } from 'js/utils/array-utils';
import SearchList from 'js/components/shared/advanced-search/home';
const filterLabel = filterKeyDeburr(['prefLabelLg1']);
const fields = ['prefLabelLg1'];

class SearchFormList extends AbstractSearchComponent {
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
				<Link to={`/operations/operation/${id}`}>{prefLabelLg1}</Link>
			</li>
		));
		return (
			<SearchList
				title={D.operationsSearchTitle}
				data={dataLinks}
				backUrl="/operations/families"
				initializeState={this.initializeState}
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
			</SearchList>
		);
	}
}
class SearchListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillMount() {
		api.getOperationsSearchList().then(data => {
			this.setState({ data });
		});
	}

	render() {
		const { data } = this.state;
		if (!data) return <Loading textType="loading" />;
		return <SearchFormList data={data} />;
	}
}

export default SearchListContainer;
