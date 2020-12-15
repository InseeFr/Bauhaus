import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	PageTitle,
	NewButton,
	VerticalMenu,
	Pagination,
	filterKeyDeburr,
	nbResults,
} from '@inseefr/wilco';
import D from 'js/i18n';
import { BOTH, DOCUMENT, LINK, isLink, isDocument } from './utils';
import { Auth, FilterToggleButtons } from 'bauhaus-utilities';
import { Link, useHistory } from 'react-router-dom';

const sessionStorageKey = 'documents-displayMode';
const SearchableList = ({
	items = [],
	placeholder,
	childPath,
	label,
	autoFocus,
	searchValue = '',
	itemFormatter = (content) => content,
}) => {
	const [search, handleSearch] = useState(searchValue);

	const filter = filterKeyDeburr(
		['label']
	);
	const hits = items.filter(filter(search));

	const hitEls = hits.map((item) => (
		<li key={item.id} className="list-group-item">
			<Link to={`/${childPath(item)}/${item.id}`}>
				{itemFormatter(item[label], item)}
			</Link>
		</li>
	));

	return (
		<div className={`=text-center`}>
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

			<p className="text-center" aria-live="assertive">
				{nbResults(hits, D)}
			</p>
			<Pagination itemEls={hitEls} itemsPerPage="10" />
		</div>
	);
};

function DocumentHome({ documents }) {
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
			history.push(window.location.pathname + '?page=1');

			setFilter(mode);
		},
		[history]
	);

	useEffect(() => {
		sessionStorage.setItem(sessionStorageKey, filter);
	}, [filter]);

	return (
		<div className="container documents-home">
			<div className="row">
				<Auth.AuthGuard
					roles={[
						Auth.ADMIN,
						Auth.INDICATOR_CONTRIBUTOR,
						Auth.SERIES_CONTRIBUTOR,
					]}
				>
					<VerticalMenu>
						{[
							['/operations/document/create', D.document],
							['/operations/link/create', D.link],
						].map(([url, title], index) => (
							<NewButton
								key={index}
								action={url}
								wrapper={false}
								label={`${D.btnNewMale} ${title}`}
							/>
						))}
					</VerticalMenu>
				</Auth.AuthGuard>

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
			</div>
		</div>
	);
}

DocumentHome.propTypes = {
	documents: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			uri: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default DocumentHome;
