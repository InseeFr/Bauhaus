import React from 'react';
import { PageTitle } from '@inseefr/wilco';
import Controls from './controls';
import Members from './members';
import { CheckSecondLang } from 'bauhaus-utilities';

const FamilyVisualization = ({
	family: {
		general: { prefLabelLg1 },
		members,
	},
	secondLang,
}) => {
	return (
		<div className="container">
			<PageTitle title={prefLabelLg1} context="classifications" />
			<Controls />
			<CheckSecondLang />
			{members.length !== 0 && (
				<Members members={members} secondLang={secondLang} />
			)}
		</div>
	);
};

export default FamilyVisualization;
