import { useState } from 'react';
import { PageTitle, NumberResult } from '@inseefr/wilco';
import Pagination from '../pagination';
import AdvancedSearchControls from '../advanced-search/controls';
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

export default AdvancedSearchList;
