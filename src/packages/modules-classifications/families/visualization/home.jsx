import { PageTitle, CheckSecondLang } from '../../../components';
import Controls from './controls';
import Members from './members';
import D from '../../../deprecated-locales/build-dictionary';
import { useTitle } from '../../../utils/hooks/useTitle';

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
