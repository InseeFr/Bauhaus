import { PageTitle } from '../../../new-architecture/components';
import Controls from './controls';
import ConceptGeneral from '../visualization/general';
import CompareNotes from '../../../applications/shared/note-compare';
import { buildNotes } from '../../../utils/concepts/notes';
import { CheckSecondLang } from '../../../utils';

const ConceptCompare = ({ conceptGeneral, notes, secondLang, langs }) => {
	const { prefLabelLg1, prefLabelLg2 } = conceptGeneral;
	const version = Number(conceptGeneral.conceptVersion);
	return (
		<div>
			<div className="container">
				<PageTitle title={secondLang ? prefLabelLg2 : prefLabelLg1} />
				<Controls />
				<CheckSecondLang />

				<ConceptGeneral
					attr={conceptGeneral}
					secondLang={secondLang}
					langs={langs}
				/>
				<CompareNotes
					secondLang={secondLang}
					notes={notes}
					langs={langs}
					version={version}
					buildNotes={buildNotes}
				/>
			</div>
		</div>
	);
};

export default ConceptCompare;
