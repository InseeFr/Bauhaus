import { PropsWithChildren, useState } from 'react';
import { PageTitle, Pagination } from '../../components';
import { AdvancedSearchControls } from './controls';
import { NumberResults } from '../number-results';

type AdvancedSearchListTypes = {
	title: string;
	data: any;
	initializeState?: any;
	redirect?: any;
};
export const AdvancedSearchList = ({
	title,
	children,
	data,
	initializeState,
	redirect,
}: Readonly<PropsWithChildren<AdvancedSearchListTypes>>) => {
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
						<NumberResults results={data} />
					</h4>
					<Pagination itemEls={data} />
				</div>
			</div>
		</div>
	);
};
