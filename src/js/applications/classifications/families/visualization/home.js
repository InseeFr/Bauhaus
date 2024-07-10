import { PageTitle } from 'js/new-architecture/components';
import Controls from './controls';
import Members from './members';
import { CheckSecondLang, useTitle } from 'js/utils';
import D from '../../../../i18n/build-dictionary';

const FamilyVisualization = ({
	family: {
		general: { prefLabelLg1 },
		members,
	},
	secondLang,
}) => {
	useTitle(D.familiesTitle + ' - ' + D.classificationsTitle, prefLabelLg1);

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
