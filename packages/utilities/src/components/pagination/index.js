import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Link from '../link';
import queryString from 'query-string';
import './pagination.scss';
import D from '../../i18n/build-dictionary';
function checkInvalidPage(targetPage, listSize) {
	return targetPage === 0 || targetPage > listSize;
}
/**
 * Component used to display a pagination block for a list.
 *	itemEls: The list of item we want to paginate
 *	itemsPerPage: The number of element per page
 *	context: The context of the page. Used for theming
 */
export const Index = ({ location: { pathname, search }, itemEls, itemsPerPage }) => {
	const paginationD = D.pagination || {};
	const ariaLabel = number => `${paginationD.goTo} ${number}`;
	if (!itemsPerPage) return null;

	const queryParams = queryString.parse(search);
	let currentPage = parseInt(queryParams.page || '1', 10);

	if (itemEls.length < (itemsPerPage * (currentPage - 1))) {
		currentPage = 1;
	}
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = itemEls.slice(indexOfFirstItem, indexOfLastItem);

	// Logic for displaying page numbers
	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(itemEls.length / itemsPerPage); i++) {
		pageNumbers.push(i);
	}

	function isActivePage(page) {
		return page === currentPage;
	}

	function isDisabled(targetPage) {
		return checkInvalidPage(targetPage, pageNumbers.length);
	}

	let pathnamePrefix = pathname + "?";
	const searchParams = new URLSearchParams(window.location.search);
	searchParams.delete("page");
	const queryParameters = searchParams.toString();
	if (queryParameters !== "") {
		pathnamePrefix += (queryParameters + "&");
	}

	console.log(pathnamePrefix);
	const renderPageNumbers = pageNumbers
		.filter(number => number - 3 < currentPage && number + 3 > currentPage)
		.map(number => {
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
			TEST
			<ul className="list-group">{currentItems}</ul>
			{pageNumbers.length > 1 && (
				<div>
					<ul className={`wilco-pagination`}>
						<li>
							<Link
								to={`${pathnamePrefix}page=1`}
								aria-label={ariaLabel(1)}
								disabled={isDisabled(currentPage - 1)}
							>
								<span aria-hidden="true">&laquo;</span>
								<span className="sr-only">First</span>
							</Link>
						</li>
						<li>
							<Link
								to={`${pathnamePrefix}page=${currentPage - 1}`}
								aria-label={ariaLabel(currentPage - 1)}
								disabled={isDisabled(currentPage - 1)}
							>
								<span aria-hidden="true">&lt;</span>
								<span className="sr-only">Previous</span>
							</Link>
						</li>
						{renderPageNumbers}
						<li>
							<Link
								to={`${pathnamePrefix}page=${currentPage + 1}`}
								aria-label={ariaLabel(currentPage + 1)}
								disabled={isDisabled(currentPage + 1)}
							>
								<span aria-hidden="true">&gt;</span>
								<span className="sr-only">Next</span>
							</Link>
						</li>
						<li>
							<Link
								aria-label={ariaLabel(pageNumbers[pageNumbers.length - 1])}
								to={`${pathnamePrefix}page=${pageNumbers[pageNumbers.length - 1]}`}
								disabled={isDisabled(currentPage + 1)}
							>
								<span aria-hidden="true">&raquo;</span>
								<span className="sr-only">Last</span>
							</Link>
						</li>
					</ul>
				</div>
			)}
		</Fragment>
	)
};

Index.propTypes = {
	itemEls: PropTypes.arrayOf(PropTypes.element).isRequired,
	itemsPerPage: PropTypes.string.isRequired,
};

export default withRouter(Index);
