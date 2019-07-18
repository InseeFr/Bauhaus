import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './pagination.scss';
import { ApplicationContext } from 'js/context';

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
	static propTypes = {
		itemEls: PropTypes.arrayOf(PropTypes.element).isRequired,
		itemsPerPage: PropTypes.string.isRequired,
		context: PropTypes.oneOf([
			'',
			'concepts',
			'collections',
			'classifications',
			'operations',
		]),
	};
	static contextType = ApplicationContext;
	constructor(props) {
		super(props);
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
	componentWillReceiveProps({ itemEls, itemsPerPage }) {
		const { currentPage } = this.state;
		const pageMax = Math.ceil(itemEls.length / itemsPerPage) || 1;
		if (currentPage > pageMax) this.goToPage(pageMax);
	}

	render() {
		const ctx = this.props.context || this.context;
		const { currentPage } = this.state;
		const { itemEls, itemsPerPage } = this.props;

		if (!itemsPerPage) return null;

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
						<button
							href="#"
							onClick={e => this.goToPage(number, e)}
							className="page-link"
						>
							{number}
						</button>
					</li>
				);
			});

		const contextCSS = ctx ? `pg-rmes-${ctx}` : '';
		return (
			<div>
				<ul className="list-group">{currentItems}</ul>
				{pageNumbers.length > 1 && (
					<ul className={`pagination pg-rmes ${contextCSS}`}>
						<li className={isDisabled(currentPage - 1) ? 'disabled' : ''}>
							<button
								onClick={e => this.goToPage(1, e)}
								aria-label="First"
								disabled={isDisabled(currentPage - 1)}
							>
								<span aria-hidden="true">&laquo;</span>
								<span className="sr-only">First</span>
							</button>
						</li>
						<li className={isDisabled(currentPage - 1) ? 'disabled' : ''}>
							<button
								href="#"
								onClick={e =>
									!checkInvalidPage(currentPage - 1) &&
									this.goToPage(currentPage - 1, e)
								}
								aria-label="Previous"
								disabled={isDisabled(currentPage - 1)}
							>
								<span aria-hidden="true">&lt;</span>
								<span className="sr-only">Previous</span>
							</button>
						</li>
						{renderPageNumbers}
						<li className={isDisabled(currentPage + 1) ? 'disabled' : ''}>
							<button
								href="#"
								onClick={e =>
									!checkInvalidPage(currentPage + 1) &&
									this.goToPage(currentPage + 1, e)
								}
								aria-label="Next"
								disabled={isDisabled(currentPage + 1)}
							>
								<span aria-hidden="true">&gt;</span>
								<span className="sr-only">Next</span>
							</button>
						</li>
						<li className={isDisabled(currentPage + 1) ? 'disabled' : ''}>
							<button
								aria-label="Last"
								href="#"
								onClick={e =>
									this.goToPage(pageNumbers[pageNumbers.length - 1], e)
								}
								disabled={isDisabled(currentPage + 1)}
							>
								<span aria-hidden="true">&raquo;</span>
								<span className="sr-only">Last</span>
							</button>
						</li>
					</ul>
				)}
			</div>
		);
	}
}

export default Pagination;
