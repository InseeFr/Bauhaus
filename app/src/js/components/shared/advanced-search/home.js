import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import PageTitle from 'js/components/shared/page-title';
import Controls from './controls';
import Pagination from 'js/components/shared/pagination';
import { nbResults } from 'js/utils/array-utils';

const SearchList = ({ title, backUrl, children, data, initializeState }) => {
	const [askForReturn, askForReturnChange] = useState(false);

	if (askForReturn) return <Redirect to={backUrl} push />;

	return (
		<div>
			<div className="container">
				<PageTitle title={title} />
				<Controls
					onClickReturn={() => {
						askForReturnChange(true);
					}}
					initializeState={initializeState}
				/>
				{children}
				<div className="centered">
					<div>
						<h4>{nbResults(data)}</h4>
					</div>
					<div>
						<Pagination itemEls={data} itemsPerPage="10" />
					</div>
				</div>
			</div>
		</div>
	);
};

SearchList.propTypes = {
	data: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default SearchList;
