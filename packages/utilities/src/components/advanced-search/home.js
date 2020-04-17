import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PageTitle, Pagination } from '@inseefr/wilco';
import AdvancedSearchControls from '../advanced-search/controls';
import NumberResult from '../number-result';
const AdvancedSearchList = ({
	title,
	children,
	data,
	initializeState,
	redirect,
}) => {
	const [askForReturn, askForReturnChange] = useState(false);

	if (askForReturn) return redirect;

	return (
		<div>
			<div className="container">
				<PageTitle title={title} />
				<AdvancedSearchControls
					onClickReturn={() => {
						askForReturnChange(true);
					}}
					initializeState={initializeState}
				/>
				{children}
				<div className="text-center">
					<h4>
						<NumberResult results={data} />
					</h4>
					<Pagination itemEls={data} itemsPerPage="10" />
				</div>
			</div>
		</div>
	);
};

AdvancedSearchList.propTypes = {
	data: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default AdvancedSearchList;
