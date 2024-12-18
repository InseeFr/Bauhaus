import { PropsWithChildren, useState } from 'react';

import { PageTitle } from '@components/page-title';
import { Pagination } from '@components/pagination';

import { NumberResults } from '../number-results';
import { AdvancedSearchControls } from './controls';

interface AdvancedSearchListTypes {
	title: string;
	data: JSX.Element[];
	initializeState?: unknown;
	redirect?: JSX.Element;
}
export const AdvancedSearchList = ({
	title,
	children,
	data,
	initializeState,
	redirect,
}: Readonly<PropsWithChildren<AdvancedSearchListTypes>>) => {
	const [askForReturn, setAskForReturn] = useState(false);

	if (askForReturn) return redirect;

	return (
		<div>
			<div className="container">
				<PageTitle title={title} />
				<AdvancedSearchControls
					onClickReturn={() => {
						setAskForReturn(true);
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
