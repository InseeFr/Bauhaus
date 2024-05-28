import React from 'react';
import { PageTitle } from '@inseefr/wilco';
import Controls from './controls';
import ConceptGeneral from '../visualization/general';
import CompareNotes from 'js/applications/shared/note-compare';
import { buildNotes } from 'js/utils/concepts/notes';
import { CheckSecondLang } from 'js/utils';

const ConceptCompare = ({ id, conceptGeneral, notes, secondLang, langs }) => {
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
