import D from 'js/i18n';
import { connect } from 'react-redux';
import * as select from 'js/reducers';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import Loading from 'js/components/shared/loading';
import loadSeriesList from 'js/actions/operations/series/list';
import { AbstractSearchComponent } from 'js/components/shared/advanced-search/home-container';

import { filterKeyDeburr } from 'js/utils/array-utils';
import SearchList from 'js/components/shared/advanced-search/home';
const filterLabel = filterKeyDeburr(['label']);
const fields = ['label'];

class SearchFormList extends AbstractSearchComponent {
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
			<li key={id} className="list-group-item">
				<Link to={`/operations/series/${id}`}>{label}</Link>
			</li>
		));
		return (
			<SearchList
				title={D.seriesSearchTitle}
				data={dataLinks}
				backUrl="/operations/series"
				initializeState={this.initializeState}
			>
				<div className="row form-group">
					<div className="col-md-12">
						<input
							value={label}
							onChange={e => this.handlers.label(e.target.value)}
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
	componentWillMount() {
		const { data } = this.props;
		if (!data) this.props.loadData();
	}

	render() {
		const { data } = this.props;
		if (!data) return <Loading textType="loading" context="concepts" />;
		return <SearchFormList data={data} />;
	}
}

const mapStateToProps = state => ({
	data: select.getSeries(state).results,
});
const mapDispatchToProps = {
	loadData: loadSeriesList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchListContainer);
