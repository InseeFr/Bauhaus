import { PageTitle, CheckSecondLang } from '../../../components';
import { CompareNotes } from '../../../components/note-compare';
import Controls from './controls';
import General from '../general';
import { buildNotes } from '../../utils/classification/notes';

const Compare = ({ classificationId, itemId, general, notes, secondLang }) => {
	const { prefLabelLg1, prefLabelLg2 } = general;
	const version = Number(general.conceptVersion);
	return (
		<div>
			<div className="container">
				<PageTitle title={secondLang ? prefLabelLg2 : prefLabelLg1} />
				<Controls />
				<CheckSecondLang />

				<General
					general={general}
					classificationId={classificationId}
					itemId={itemId}
					secondLang={secondLang}
				/>
				<CompareNotes
					secondLang={secondLang}
					notes={notes}
					version={version}
					buildNotes={buildNotes}
				/>
			</div>
		</div>
	);
};

export default Compare;
