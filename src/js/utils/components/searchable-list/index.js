import { Link } from 'react-router-dom';
import Pagination from '../pagination';
import { filterKeyDeburr, nbResults } from '../../utils/array-utils';
import D from '../../i18n/build-dictionary';
import { TextInput } from '../../../new-architecture/components/form/input';
import useUrlQueryParameters from '../../hooks/useUrlQueryParameters';

const defautState = {
	search: '',
};
const SearchableList = ({
	items = [],
	advancedSearch = false,
	searchUrl = '',
	placeholder = '',
	childPath,
	col = undefined,
	colOff = undefined,
	label = 'label',
	autoFocus = false,
	itemFormatter = (content, _object) => content,
}) => {
	const [{ search }, handleSearch] = useUrlQueryParameters(defautState);

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
			<Pagination itemEls={hitEls} itemsPerPage="10" />
		</div>
	);
};
export default SearchableList;
