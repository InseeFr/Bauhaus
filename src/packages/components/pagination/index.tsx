import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { createAllDictionary } from '../../utils/dictionnary';
import { Link } from '../link';
import { Select } from '../select-rmes';
import './pagination.scss';

const { D1, D } = createAllDictionary({
	itemPerPagePlaceholder: {
		fr: "Nombre d'éléments par page",
		en: 'Number of elements per page',
	},
	pagination: {
		goTo: {
			en: 'Go to page',
			fr: 'Allez à la page',
		},
	},
});

function checkInvalidPage(targetPage: number, listSize: number) {
	return targetPage === 0 || targetPage > listSize;
}

const numberPerPageOptions = [
	{ value: 10, label: '10' },
	{ value: 25, label: '25' },
	{ value: 100, label: '100' },
];

const paginationD = D.pagination || {};
const ariaLabel = (number?: number) =>
	number ? `${paginationD.goTo} ${number}` : '';
/**
 * Component used to display a pagination block for a list.
 *	itemEls: The list of item we want to paginate
 */
export const Pagination = ({ itemEls }: { itemEls: JSX.Element[] }) => {
	const navigate = useNavigate();
	const { pathname, search } = useLocation();

	const [numberPerPage, setNumberPerPage] = useState(10);

	const queryParams = queryString.parse(search);
	let currentPage = parseInt((queryParams.page as string) || '1', 10);

	const url = document.URL;
	useEffect(() => {
		const search = new URL(url).searchParams;

		if (search.has('perPage')) {
			setNumberPerPage(parseInt(search.get('perPage') as string, 10));
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

	function isActivePage(page: number) {
		return page === currentPage;
	}

	function isDisabled(targetPage: number) {
		return checkInvalidPage(targetPage, pageNumbers.length);
	}

	let pathnamePrefix = pathname + '?';
	const searchParams = new URLSearchParams(window.location.search);
	searchParams.delete('page');
	const queryParameters = searchParams.toString();
	if (queryParameters !== '') {
		pathnamePrefix += queryParameters + '&';
	}
	const onItemPerPageChange = (value: string) => {
		const searchParams = new URLSearchParams(window.location.search);
		searchParams.set('perPage', value);
		navigate(pathname + '?' + searchParams.toString(), { replace: true });
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
		<>
			<ul className="list-group">{currentItems}</ul>
			{pageNumbers.length > 1 && (
				<div>
					<div className="col-md-3 pull-left wilco-pagination">
						<Select
							placeholder={D1.itemPerPagePlaceholder}
							value={numberPerPageOptions.find(
								({ value }) => value === numberPerPage,
							)}
							options={numberPerPageOptions}
							onChange={onItemPerPageChange}
							unclearable
						/>
					</div>
					<div className="col-md-9" style={{ padding: 0 }}>
						<ul className="wilco-pagination pull-right">
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
									aria-label={ariaLabel(pageNumbers.at(-1))}
									to={`${pathnamePrefix}page=${pageNumbers.at(
										-1,
									)}&perPage${numberPerPage}`}
									disabled={isDisabled(currentPage + 1)}
								>
									<span aria-hidden="true">&raquo;</span>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			)}
		</>
	);
};
