import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './pagination.css';

function checkInvalidPage(targetPage, listSize) {
	return targetPage === 0 || targetPage > listSize;
}
/**
 * Component used to display a pagination block for a list.
 *	itemEls: The list of item we want to paginate
 *	itemsPerPage: The number of element per page
 *	context: The context of the page. Used for theming
 */
class Pagination extends Component {
	constructor() {
		super();
		this.state = {
			currentPage: 1,
		};
	}
	goToPage(targetPage, e) {
		if (e) e.preventDefault();
		this.setState({
			currentPage: Number(targetPage),
		});
	}
	componentWillReceiveProps() {
		this.goToPage(1);
	}

	render() {
		const { currentPage } = this.state;
		const { itemEls, itemsPerPage, context } = this.props;

		if (!itemsPerPage) return null;

		const indexOfLastItem = currentPage * itemsPerPage;
		const indexOfFirstItem = indexOfLastItem - itemsPerPage;
		const currentItems = itemEls.slice(indexOfFirstItem, indexOfLastItem);

		// Logic for displaying page numbers
		const pageNumbers = [];
		for (let i = 1; i <= Math.ceil(itemEls.length / itemsPerPage); i++) {
			pageNumbers.push(i);
		}

		function activePage(page) {
			return page === currentPage ? 'page-item active' : 'page-item';
		}
		function isDisabled(targetPage) {
			return checkInvalidPage(targetPage, pageNumbers.length)
				? 'page-item disabled'
				: 'page-item';
		}

		const renderPageNumbers = pageNumbers
			.filter(number => number - 3 < currentPage && number + 3 > currentPage)
			.map(number => {
				return (
					<li className={activePage(number)} key={number} id={number}>
						<a
							href="#"
							onClick={e => this.goToPage(number, e)}
							className="page-link"
						>
							{number}
						</a>
					</li>
				);
			});

		const contextCSS = context ? `pg-rmes-${context}` : '';
		return (
			<div>
				<ul className="list-group">{currentItems}</ul>
				{pageNumbers.length > 1 && (
					<ul className={`pagination pg-rmes ${contextCSS}`}>
						<li className="page-item">
							<a href="#" onClick={e => this.goToPage(1, e)} aria-label="First">
								<span aria-hidden="true">&laquo;</span>
								<span className="sr-only">First</span>
							</a>
						</li>
						<li className={isDisabled(currentPage - 1)}>
							<a
								href="#"
								onClick={e =>
									!isDisabled(currentPage - 1) &&
									this.goToPage(currentPage - 1, e)
								}
								aria-label="Previous"
							>
								<span aria-hidden="true">&lt;</span>
								<span className="sr-only">Previous</span>
							</a>
						</li>
						{renderPageNumbers}
						<li className={isDisabled(currentPage + 1)}>
							<a
								href="#"
								onClick={e => this.goToPage(currentPage + 1, e)}
								aria-label="Next"
							>
								<span aria-hidden="true">&gt;</span>
								<span className="sr-only">Next</span>
							</a>
						</li>
						<li className="page-item">
							<a
								aria-label="Last"
								href="#"
								onClick={e =>
									this.goToPage(pageNumbers[pageNumbers.length - 1], e)
								}
							>
								<span aria-hidden="true">&raquo;</span>
								<span className="sr-only">Last</span>
							</a>
						</li>
					</ul>
				)}
			</div>
		);
	}
}

Pagination.propTypes = {
	itemEls: PropTypes.arrayOf(PropTypes.element).isRequired,
	itemsPerPage: PropTypes.string.isRequired,
	context: PropTypes.string.isRequired,
};
export default Pagination;
