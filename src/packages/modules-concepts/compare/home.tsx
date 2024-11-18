import { CompareNotes } from '@components/note-compare';
import Controls from './controls';
import ConceptGeneral from '../visualization/general';
import { buildNotes } from '../utils/notes';
import {
	ConceptGeneral as ConceptGeneralType,
	ConceptNotes,
} from '../../model/concepts/concept';
import { PageTitle } from '@components/page-title';
import { CheckSecondLang } from '@components/check-second-lang';

type ConceptCompare = {
	conceptGeneral: ConceptGeneralType;
	notes: Record<number, ConceptNotes>;
	secondLang: boolean;
};

const ConceptCompare = ({
	conceptGeneral,
	notes,
	secondLang,
}: Readonly<ConceptCompare>) => {
	const { prefLabelLg1, prefLabelLg2 } = conceptGeneral;
	const version = Number(conceptGeneral.conceptVersion);
	return (
		<div>
			<div className="container">
				<PageTitle title={secondLang ? prefLabelLg2 : prefLabelLg1} />
				<Controls />
				<CheckSecondLang />

				<ConceptGeneral attr={conceptGeneral} secondLang={secondLang} />
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

export default ConceptCompare;
