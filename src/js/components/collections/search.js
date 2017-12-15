import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { dictionary } from 'js/utils/dictionary';
import Pagination from 'js/components/shared/pagination';
import CollectionItem from './list-item';
import { propTypes as overviewTypes } from 'js/utils/collections/collection-overview';
import { filterKeyDeburr } from 'js/utils/array-utils';

const filter = filterKeyDeburr('label');

//TODO refactor to try to share some logic with `SearchConceptsByLabel`
//TODO search facility should not be handled by this component
class CollectionListSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchLabel: '',
			hits: props.collections,
		};
		this.handleSearch = label => {
			this.setState({
				searchLabel: label,
				hits: this.props.collections.filter(filter(label)),
			});
		};
	}

	render() {
		const { searchLabel, hits } = this.state;
		const hitEls = hits.map(({ id, label }) => (
			<CollectionItem key={id} id={id} label={label} to={`/collection/${id}`} />
		));
		return (
			<div>
				<div className="row form-group">
					<div className="col-md-12">
						<input
							value={searchLabel}
							onChange={e => this.handleSearch(e.target.value)}
							type="text"
							placeholder={dictionary.collections.searchLabel}
							className="form-control"
						/>
					</div>
				</div>
				<div className="row">
					<h4>{nbResults(hits)}</h4>
				</div>
				<div>
					<Pagination itemEls={hitEls} itemsPerPage="10" />
				</div>
			</div>
		);
	}
}

function nbResults(list) {
	if (list.length > 1) return list.length + dictionary.collections.results;
	else return list.length + dictionary.collections.result;
}

CollectionListSearch.propTypes = {
	collections: PropTypes.arrayOf(overviewTypes).isRequired,
};

export default CollectionListSearch;
