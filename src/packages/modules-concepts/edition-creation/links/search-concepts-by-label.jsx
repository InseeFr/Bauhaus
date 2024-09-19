import D from '../../../deprecated-locales';
import { Pagination, TextInput } from '../../../components';

const SearchConceptsByLabel = ({ searchLabel, handleSearch, hitEls }) => {
	return (
		<div>
			<TextInput
				value={searchLabel}
				onChange={(e) => handleSearch(e.target.value)}
				placeholder={D.searchLabelPlaceholder}
			/>
			<Pagination itemEls={hitEls} />
		</div>
	);
};

export default SearchConceptsByLabel;
