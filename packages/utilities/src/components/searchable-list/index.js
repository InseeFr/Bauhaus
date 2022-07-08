import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Pagination from '../pagination';
import { filterKeyDeburr, nbResults } from '../../utils/array-utils';
import D from '../../i18n/build-dictionary';

const SearchableList = ({
													items = [],
													advancedSearch = false,
													searchUrl,
													placeholder,
													childPath,
													col,
													colOff,
													label,
													autoFocus,
													searchValue = '',
													itemFormatter = (content, item) => content,
												}) => {
	const [search, handleSearch] = useState(searchValue);

	const filter = filterKeyDeburr(
		Object.keys(items[0] || {}).filter((k) => k !== 'id')
	);

	const hits = items.filter(filter(search));

	const hitEls = hits.map((item) => (
		<li key={item.id} className="list-group-item">
			<Link to={`/${childPath}/${item.id}`}>
				{itemFormatter(item[label], item)}
			</Link>
		</li>
	));

	const colSize = col ? `col-md-${col}` : '';
	const colOffset = colOff ? `col-md-offset-${colOff}` : '';

	return (
		<div className={`${colSize} ${colOffset}`}>
			<div className="row form-group">
				<div className="col-md-12">
					<input
						value={search}
						onChange={(e) => handleSearch(e.target.value)}
						type="text"
						placeholder={D.searchLabelPlaceholder || placeholder}
						className="form-control"
						aria-label={D.search}
						autoFocus={autoFocus}
					/>
				</div>
			</div>
			{advancedSearch && (
				<div className="row">
					<div className="col-md-12">
						<Link to={searchUrl}>
							<h2>
								<span
									className="glyphicon glyphicon-zoom-in"
									aria-hidden="true"
								/>
								{D.advancedSearchTitle}
							</h2>
						</Link>
					</div>
				</div>
			)}
			<p aria-live="assertive">{nbResults(hits, D.results, D.result)}</p>
			<Pagination itemEls={hitEls} itemsPerPage="10"/>
		</div>
	);
};

SearchableList.defaultProps = {
	label: 'label',
	autoFocus: false,
};

SearchableList.propTypes = {
	items: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
	childPath: PropTypes.string.isRequired,
	advancedSearch: PropTypes.bool,
	searchUrl: PropTypes.string,
	placeholder: PropTypes.string,
	col: PropTypes.number,
	colOff: PropTypes.number,
	label: PropTypes.string,
	autoFocus: PropTypes.bool,
};

export default SearchableList;
