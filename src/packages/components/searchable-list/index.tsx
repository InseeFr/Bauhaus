import { Link } from 'react-router-dom';

import { TextInput } from '@components/form/input';
import { Row } from '@components/layout';
import { Pagination } from '@components/pagination';

import { filterKeyDeburr, nbResults } from '@utils/array-utils';
import { createAllDictionary } from '@utils/dictionnary';
import useUrlQueryParameters from '@utils/hooks/useUrlQueryParameters';

const { D } = createAllDictionary({
	searchLabelPlaceholder: {
		fr: 'Libellé...',
		en: 'Label...',
	},
	search: {
		fr: 'Recherchez...',
		en: 'Search...',
	},
	advancedSearchTitle: {
		fr: 'Recherche avancée',
		en: 'Advanced search',
	},
	result: {
		fr: 'résultat',
		en: 'result',
	},
	results: {
		fr: 'résultats',
		en: 'results',
	},
});

const defautState = {
	search: '',
};

type SearchableListTypes = {
	items: any[];
	advancedSearch?: boolean;
	searchUrl?: string;
	placeholder?: string;
	childPath?: any;
	col?: number;
	colOff?: number;
	label?: string;
	autoFocus?: boolean;
	itemFormatter?: any;
};
export const SearchableList = ({
	items = [],
	advancedSearch = false,
	searchUrl = '',
	placeholder = '',
	childPath,
	col = undefined,
	colOff = undefined,
	label = 'label',
	autoFocus = false,
	itemFormatter = (content: any) => content,
}: SearchableListTypes) => {
	const {
		form: { search },
		setForm: handleSearch,
	} = useUrlQueryParameters(defautState);

	const filter = filterKeyDeburr(
		Object.keys(items[0] || {}).filter((k) => k !== 'id'),
	);

	const hits = items.filter(filter(search));

	const hitEls = hits.map((item: any) => (
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
					<TextInput
						value={search}
						onChange={(e) => {
							handleSearch({ search: e.target.value });
						}}
						placeholder={D.searchLabelPlaceholder || placeholder}
						aria-label={D.search}
						autoFocus={autoFocus}
					/>
				</div>
			</div>
			{advancedSearch && (
				<Row>
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
				</Row>
			)}
			<p aria-live="assertive">{nbResults(hits, D.results, D.result)}</p>
			<Pagination itemEls={hitEls} />
		</div>
	);
};
