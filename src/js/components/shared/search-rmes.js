import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { dictionary } from 'js/utils/dictionary';
import Pagination from 'js/components/shared/pagination';
import { filterKeyDeburr, nbResults } from 'js/utils/array-utils';

const filter = filterKeyDeburr(['label', 'altLabel']);

class SearchRmes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			hits: props.items,
		};
		this.handleSearch = search => {
			this.setState({
				search,
				hits: this.props.items.filter(filter(search)),
			});
		};
	}

	render() {
		const { search, hits } = this.state;
		const { concepts, childPath, col, colOff } = this.props;
		//{`col-md-${col ? col : 12} col-md-offset-${	colOff ? colOff : 0}`}
		const hitEls = hits.map(({ id, label }) => (
			<li key={id} className="list-group-item">
				<Link to={`/${childPath}/${id}`}>{label}</Link>
			</li>
		));

		const colSize = col ? `col-md-${col}` : null;
		const colOffset = colOff ? `col-md-offset-${colOff}` : null;

		return (
			<div className={`${colSize} ${colOffset}`}>
				<div className="row form-group">
					<div className="col-md-12">
						<input
							value={search}
							onChange={e => this.handleSearch(e.target.value)}
							type="text"
							placeholder={dictionary.concepts.searchLabel}
							className="form-control"
						/>
					</div>
				</div>
				{concepts && (
					<div className="row">
						<div className="col-md-12">
							<Link to={'/concepts/search'}>
								<h3 className="glyphicon glyphicon-zoom-in inline"> </h3>
								<h3 className="inline">{dictionary.concepts.advancedSearch}</h3>
							</Link>
						</div>
					</div>
				)}
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

SearchRmes.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	).isRequired,
	childPath: PropTypes.string.isRequired,
	concepts: PropTypes.bool,
	col: PropTypes.number,
	colOff: PropTypes.number,
};

export default SearchRmes;
