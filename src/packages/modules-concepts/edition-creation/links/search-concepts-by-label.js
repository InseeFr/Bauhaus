import { Pagination } from '@inseefr/wilco';
import D from '../../../deprecated-locales';
import { TextInput } from '../../../components';

const SearchConceptsByLabel = ({ searchLabel, handleSearch, hitEls }) => {
	return (
		<div>
			<TextInput
				value={searchLabel}
				onChange={(e) => handleSearch(e.target.value)}
				placeholder={D.searchLabelPlaceholder}
			/>
			<Pagination itemEls={hitEls} itemsPerPage="10" />
		</div>
	);
};

export default SearchConceptsByLabel;
