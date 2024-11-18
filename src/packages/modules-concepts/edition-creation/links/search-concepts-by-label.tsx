import { TextInput } from '@components/form/input';
import D from '../../../deprecated-locales';
import { Pagination } from '@components/pagination';

type SearchConceptsByLabelTypes = {
	searchLabel: string;
	hitEls: JSX.Element[],
	handleSearch: (value: string) => void	
}

const SearchConceptsByLabel = ({ searchLabel, handleSearch, hitEls }: Readonly<SearchConceptsByLabelTypes>) => {
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
