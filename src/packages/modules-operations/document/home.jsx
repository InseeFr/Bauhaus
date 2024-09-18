import { useState, useCallback, useEffect } from 'react';
import { PageTitle, TextInput, Pagination, Row } from '../../components';

import D from '../../deprecated-locales';
import { BOTH, DOCUMENT, LINK, isLink, isDocument } from './utils';
import { Link, useHistory, useLocation } from 'react-router-dom';
import FilterToggleButtons from '../../components/filter-toggle-buttons';
import { useTitle } from '../../utils/hooks/useTitle';
import { Menu } from './menu';
import { filterKeyDeburr } from '../../utils/array-utils';
import { NumberResults } from '../../components/number-results';

const formatter = (content, label) => {
	const extraInformations = [];
	if (content.lang) {
		extraInformations.push(content.lang);
	}
	if (content.updatedDate) {
		const [year, month, day] = content.updatedDate.split('-');
		extraInformations.push(`${day}/${month}/${year}`);
	}
	return (
		<>
			{content[label]}{' '}
			<i>
				{extraInformations.length > 0 ? `(${extraInformations.join('-')})` : ''}
			</i>
		</>
	);
};

const sessionStorageKey = 'documents-displayMode';
const SearchableList = ({
	items = [],
	placeholder,
	childPath,
	label,
	autoFocus,
	searchValue = '',
}) => {
	const history = useHistory();
	const location = useLocation();

	const [search, setSearch] = useState(searchValue);

	const url = document.URL;
	useEffect(() => {
		const searchQuery = new URL(url).searchParams;

		if (searchQuery.has('search')) {
			setSearch(searchQuery.get('search'));
		}
	}, [url]);

	const handleSearch = (value) => {
		const searchParams = new URLSearchParams(window.location.search);
		searchParams.set('search', value);
		history.replace(location.pathname + '?' + searchParams.toString());
	};

	const filter = filterKeyDeburr(['label']);
	const hits = items.filter(filter(search));

	const hitEls = hits.map((item) => (
		<li key={item.id} className="list-group-item">
			<Link to={`/${childPath(item)}/${item.id}`}>
				{formatter(item, label)}
			</Link>
		</li>
	));

	return (
		<>
			<div className="row form-group">
				<div className="col-md-12">
					<TextInput
						value={search}
						onChange={(e) => {
							handleSearch(e.target.value);
							setSearch(e.target.value);
						}}
						placeholder={D.searchLabelPlaceholder || placeholder}
						aria-label={D.search}
						autoFocus={autoFocus}
					/>
				</div>
			</div>

			<p className="text-center" aria-live="assertive">
				<NumberResults results={hits} />
			</p>
			<Pagination itemEls={hitEls} />
		</>
	);
};

function DocumentHome({ documents }) {
	useTitle(D.operationsTitle, D.documentsTitle);

	const history = useHistory();
	const queryMode = sessionStorage.getItem(sessionStorageKey);

	const [filter, setFilter] = useState(queryMode || BOTH);

	const filteredDocuments = documents.filter((document) => {
		return (
			filter === BOTH ||
			(filter === DOCUMENT && isDocument(document)) ||
			(filter === LINK && isLink(document))
		);
	});

	const onFilter = useCallback(
		(mode) => {
			sessionStorage.setItem(sessionStorageKey, mode);
			setFilter(mode);
			history.replace(window.location.pathname + '?page=1');
		},
		[history]
	);

	return (
		<div className="container documents-home">
			<Row>
				<Menu></Menu>

				<div className="col-md-8 text-center pull-right operations-list">
					<PageTitle title={D.documentsSearchTitle} col={12} offset={0} />
					<FilterToggleButtons
						currentValue={filter}
						handleSelection={onFilter}
						options={[
							[DOCUMENT, D.document],
							[BOTH, `${D.document} / ${D.titleLink}`],
							[LINK, D.titleLink],
						]}
					/>
					<SearchableList
						items={filteredDocuments}
						childPath={(document) => {
							if (isDocument(document)) {
								return 'operations/document';
							}
							return 'operations/link';
						}}
						label="label"
						autoFocus={true}
					/>
				</div>
			</Row>
		</div>
	);
}

export default DocumentHome;
