import { Pagination } from '@inseefr/wilco';
import D from '../../../../i18n';
import { TextInput } from '../../../../new-architecture/components/form/input';

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
