import { PageSubtitle } from '@inseefr/wilco';
import { PageTitle, CheckSecondLang } from '../../../components';
import Controls from './controls';
import General from './general';
import Notes from './notes';
import Members from './members';
import D from '../../../deprecated-locales/build-dictionary';
import { useTitle } from '../../../utils/hooks/useTitle';

const SeriesVisualization = ({ series: { general, members }, secondLang }) => {
	useTitle(
		D.seriesTitle + ' - ' + D.classificationsTitle,
		general?.prefLabelLg1
	);

	const notes = {
		scopeNoteLg1: general.scopeNoteLg1,
		scopeNoteLg2: general.scopeNoteLg2,
	};
	return (
		<div className="container">
			<PageTitle title={general.prefLabelLg1} />
			{general.prefLabelLg2 && <PageSubtitle subTitle={general.prefLabelLg2} />}
			<Controls />
			<CheckSecondLang />
			<General general={general} secondLang={secondLang} />
			{notes.scopeNoteLg1 && <Notes notes={notes} secondLang={secondLang} />}
			{members.length !== 0 && (
				<Members members={members} secondLang={secondLang} />
			)}
		</div>
	);
};

export default SeriesVisualization;
