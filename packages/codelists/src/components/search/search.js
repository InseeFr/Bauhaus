import { Link, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import { Loading } from '@inseefr/wilco';
import api from 'js/remote-api/operations-api';
import D from '../../i18n/build-dictionary';

import {
	ArrayUtils,
	AbstractAdvancedSearchComponent,
	AdvancedSearchList,
} from 'bauhaus-utilities';

const filterLabel = ArrayUtils.filterKeyDeburr(['labelLg1']);
const fields = ['labelLg1'];
const sortByLabel = ArrayUtils.sortArray('labelLg1');

class SearchFormList extends AbstractAdvancedSearchComponent {
	static defaultState = {
		labelLg1: '',
	};

	constructor(props) {
		super(props, SearchFormList.defaultState);
	}

	handlers = this.handleChange(fields, (newState) => {
		const { labelLg1 } = newState;
		return this.props.data.filter(filterLabel(labelLg1));
	});

	render() {
		const { data, labelLg1 } = this.state;
		const dataLinks = data.map(({ notation, labelLg1 }) => (
			<li key={notation} className="list-group-item">
				<Link to={`/codelists/components/${notation}`}>{labelLg1}</Link>
			</li>
		));
		return (
			<AdvancedSearchList
				title={D.familiesSearchTitle}
				data={dataLinks}
				initializeState={this.initializeState}
				redirect={<Redirect to={'/codelists'} push />}
			>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.labelTitle}
							<input
								value={labelLg1}
								onChange={(e) => this.handlers.labelLg1(e.target.value)}
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
class SearchListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillMount() {
		api.getFamiliesSearchList().then((data) => {
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
