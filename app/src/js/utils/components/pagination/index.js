import React, { Fragment, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Link from '../link';
import queryString from 'query-string';
import './pagination.scss';
import D from '../../i18n/build-dictionary';
import { default as ReactSelect } from 'react-select';
import { D1 } from '../../../applications/codelists/i18n/build-dictionary';

function checkInvalidPage(targetPage, listSize) {
	return targetPage === 0 || targetPage > listSize;
}

const numberPerPageOptions = [
	{ value: 10, label: 10 },
	{ value: 25, label: 25 },
	{ value: 100, label: 100 },
];
/**
 * Component used to display a pagination block for a list.
 *	itemEls: The list of item we want to paginate
 */
export const Index = ({ itemEls }) => {
	const history = useHistory();
	const { pathname, search } = useLocation();

	const [numberPerPage, setNumberPerPage] = useState(10);
	const paginationD = D.pagination || {};
	const ariaLabel = (number) => `${paginationD.goTo} ${number}`;

	const queryParams = queryString.parse(search);
	let currentPage = parseInt(queryParams.page || '1', 10);

	const url = document.URL;
	useEffect(() => {
		const search = new URL(url).searchParams;

		if (search.has('perPage')) {
			setNumberPerPage(parseInt(search.get('perPage'), 10));
		}
	}, [url]);

	if (itemEls.length < numberPerPage * (currentPage - 1)) {
		currentPage = 1;
	}
	const indexOfLastItem = currentPage * numberPerPage;
	const indexOfFirstItem = indexOfLastItem - numberPerPage;
	const currentItems = itemEls.slice(indexOfFirstItem, indexOfLastItem);

	// Logic for displaying page numbers
	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(itemEls.length / numberPerPage); i++) {
		pageNumbers.push(i);
	}

	function isActivePage(page) {
		return page === currentPage;
	}

	function isDisabled(targetPage) {
		return checkInvalidPage(targetPage, pageNumbers.length);
	}

	let pathnamePrefix = pathname + '?';
	const searchParams = new URLSearchParams(window.location.search);
	searchParams.delete('page');
	const queryParameters = searchParams.toString();
	if (queryParameters !== '') {
		pathnamePrefix += queryParameters + '&';
	}
	const onItemPerPageChange = (option) => {
		const searchParams = new URLSearchParams(window.location.search);
		searchParams.set('perPage', option?.value);
		history.replace(pathname + '?' + searchParams.toString());
	};

	const renderPageNumbers = pageNumbers
		.filter((number) => number - 3 < currentPage && number + 3 > currentPage)
		.map((number) => {
			return (
				<li className={isActivePage(number) ? 'active' : ''} key={number}>
					<Link
						to={`${pathnamePrefix}page=${number}`}
						aria-label={ariaLabel(number)}
						aria-current={number === currentPage}
					>
						{number}
					</Link>
				</li>
			);
		});

	return (
		<Fragment>
			<ul className="list-group">{currentItems}</ul>
			{pageNumbers.length > 1 && (
				<div>
					<div className="col-md-3 pull-left wilco-pagination">
						<ReactSelect
							placeholder={D1.itemPerPagePlaceholder}
							value={numberPerPageOptions.find(
								({ value }) => value === numberPerPage
							)}
							options={numberPerPageOptions}
							onChange={onItemPerPageChange}
							clearable={false}
						/>
					</div>
					<div className="col-md-9" style={{ padding: 0 }}>
						<ul className={`wilco-pagination pull-right`}>
							<li>
								<Link
									to={`${pathnamePrefix}page=1&perPage${numberPerPage}`}
									aria-label={ariaLabel(1)}
									disabled={isDisabled(currentPage - 1)}
								>
									<span aria-hidden="true">&laquo;</span>
								</Link>
							</li>
							<li>
								<Link
									to={`${pathnamePrefix}page=${
										currentPage - 1
									}&perPage${numberPerPage}`}
									aria-label={ariaLabel(currentPage - 1)}
									disabled={isDisabled(currentPage - 1)}
								>
									<span aria-hidden="true">&lt;</span>
								</Link>
							</li>
							{renderPageNumbers}
							<li>
								<Link
									to={`${pathnamePrefix}page=${
										currentPage + 1
									}&perPage${numberPerPage}`}
									aria-label={ariaLabel(currentPage + 1)}
									disabled={isDisabled(currentPage + 1)}
								>
									<span aria-hidden="true">&gt;</span>
								</Link>
							</li>
							<li>
								<Link
									aria-label={ariaLabel(pageNumbers[pageNumbers.length - 1])}
									to={`${pathnamePrefix}page=${
										pageNumbers[pageNumbers.length - 1]
									}&perPage${numberPerPage}`}
									disabled={isDisabled(currentPage + 1)}
								>
									<span aria-hidden="true">&raquo;</span>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			)}
		</Fragment>
	);
};

export default Index;
