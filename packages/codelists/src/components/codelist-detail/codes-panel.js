import React, { Fragment, useEffect, useState } from 'react';
import { API } from '../../apis';
import { Row } from 'bauhaus-utilities';
import { CollapsiblePanel } from '../collapsible-panel';
import D from '../../i18n/build-dictionary';
import { rowParams } from '../code-detail/code-columns';
import { Table } from '@inseefr/wilco';

export const CodesCollapsiblePanel = ({ codelist, hidden }) => {
	const [codes, setCodes] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		API.getCodesDetailedCodelist(codelist.id, currentPage)
			.then((cl) => {
				setCodes(cl ?? []);
			});
	}, [codelist.id, currentPage]);


	function isActivePage(page) {
		return page === currentPage;
	}

	function checkInvalidPage(targetPage, listSize) {
		return targetPage === 0 || targetPage > listSize;
	}

	function isDisabled(targetPage) {
		return checkInvalidPage(targetPage, pageNumbers.length);
	}

	const pageNumbers = [];
	const numberOfPages = Math.ceil((codes.total ?? 0) / 5)
	for (let i = 1; i <= numberOfPages; i++) {
		pageNumbers.push(i);
	}

	const renderPageNumbers = pageNumbers
		.filter(number => number - 3 < currentPage && number + 3 > currentPage)
		.map(number => {
			return (
				<li className={isActivePage(number) ? 'active' : ''} key={number}>
					<button
						type='button'
						aria-current={number === currentPage}
						onClick={() => setCurrentPage(number)}
					>
						{number}
					</button>
				</li>
			);
		});

	return (
		<Row>
			<CollapsiblePanel
				hidden={hidden}
				title={D.listElements}
				collapsible={false}
				children={
					<Fragment>
						<Table
							rowParams={rowParams}
							data={codes.items ?? []}
						/>
						<div className='server-side-pagination col-md-12' style={{ padding: 0 }}>
							<ul className={`wilco-pagination`}>
								<li>
									<button
										type='button'
										disabled={isDisabled(currentPage - 1)}
										onClick={() => setCurrentPage(1)}
									>
										<span aria-hidden='true'>&laquo;</span>
									</button>
								</li>
								<li>
									<button
										type='button'
										disabled={isDisabled(currentPage - 1)}
										onClick={() => setCurrentPage(currentPage - 1)}
									>
										<span aria-hidden='true'>&lt;</span>
									</button>
								</li>
								{renderPageNumbers}
								<li>
									<button
										type='button'
										disabled={isDisabled(currentPage + 1)}
										onClick={() => setCurrentPage(currentPage + 1)}
									>
										<span aria-hidden='true'>&gt;</span>
									</button>
								</li>
								<li>
									<button
										type='button'
										disabled={isDisabled(currentPage + 1)}
										onClick={() => setCurrentPage(numberOfPages)}
									>
										<span aria-hidden='true'>&raquo;</span>
									</button>
								</li>
							</ul>
						</div>
					</Fragment>
				}
			/>
		</Row>
	);
};
