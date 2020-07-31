import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from '@inseefr/wilco';
import D from 'js/i18n';

const SearchConceptsByLabel = ({ searchLabel, handleSearch, hitEls }) => {
	return (
		<div>
			<input
				value={searchLabel}
				onChange={e => handleSearch(e.target.value)}
				type="text"
				placeholder={D.searchLabelPlaceholder}
				className="form-control"
			/>
			<Pagination itemEls={hitEls} itemsPerPage="10" />
		</div>
	);
};

SearchConceptsByLabel.propTypes = {
	searchLabel: PropTypes.string.isRequired,
	handleSearch: PropTypes.func.isRequired,
	hitEls: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default SearchConceptsByLabel;
