import { Pagination } from '@inseefr/wilco';
import D from 'js/i18n';

const SearchConceptsByLabel = ({ searchLabel, handleSearch, hitEls }) => {
	return (
		<div>
			<input
				value={searchLabel}
				onChange={(e) => handleSearch(e.target.value)}
				type="text"
				placeholder={D.searchLabelPlaceholder}
				className="form-control"
			/>
			<Pagination itemEls={hitEls} itemsPerPage="10" />
		</div>
	);
};

export default SearchConceptsByLabel;
