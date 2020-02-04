import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import queryString from 'query-string';
import './pagination.scss';
import D from '../build-dictionary';
function checkInvalidPage(targetPage, listSize) {
	return targetPage === 0 || targetPage > listSize;
}
/**
 * Component used to display a pagination block for a list.
 *	itemEls: The list of item we want to paginate
 *	itemsPerPage: The number of element per page
 *	context: The context of the page. Used for theming
 */
export const Pagination = React.memo(
	({ location: { pathname, search }, itemEls, itemsPerPage }) => {
		const paginationD = D.pagination || {};
		const ariaLabel = number => `${paginationD.goTo} ${number}`;
		if (!itemsPerPage) return null;

		const queryParams = queryString.parse(search);
		const currentPage = parseInt(queryParams.page || '1', 10);

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

		const renderPageNumbers = pageNumbers
			.filter(number => number - 3 < currentPage && number + 3 > currentPage)
			.map(number => {
				return (
					<li className={isActivePage(number) ? 'active' : ''} key={number}>
						<Link
							to={`${pathname}?page=${number}`}
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
						<ul className={`bauhaus-pagination`}>
							<li className={isDisabled(currentPage - 1) ? 'disabled' : ''}>
								<Link
									to={`${pathname}?page=1`}
									aria-label={ariaLabel(1)}
									disabled={isDisabled(currentPage - 1)}
								>
									<span aria-hidden="true">&laquo;</span>
									<span className="sr-only">First</span>
								</Link>
							</li>
							<li className={isDisabled(currentPage - 1) ? 'disabled' : ''}>
								<Link
									to={`${pathname}?page=${currentPage - 1}`}
									aria-label={ariaLabel(currentPage - 1)}
									disabled={isDisabled(currentPage - 1)}
								>
									<span aria-hidden="true">&lt;</span>
									<span className="sr-only">Previous</span>
								</Link>
							</li>
							{renderPageNumbers}
							<li className={isDisabled(currentPage + 1) ? 'disabled' : ''}>
								<Link
									to={`${pathname}?page=${currentPage + 1}`}
									aria-label={ariaLabel(currentPage + 1)}
									disabled={isDisabled(currentPage + 1)}
								>
									<span aria-hidden="true">&gt;</span>
									<span className="sr-only">Next</span>
								</Link>
							</li>
							<li className={isDisabled(currentPage + 1) ? 'disabled' : ''}>
								<Link
									aria-label={ariaLabel(pageNumbers[pageNumbers.length - 1])}
									to={`${pathname}?page=${pageNumbers[pageNumbers.length - 1]}`}
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
		);
	}
);

Pagination.propTypes = {
	itemEls: PropTypes.arrayOf(PropTypes.element).isRequired,
	itemsPerPage: PropTypes.string.isRequired,
};

export default withRouter(Pagination);
