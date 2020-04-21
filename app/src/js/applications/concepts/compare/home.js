import React from 'react';
import PropTypes from 'prop-types';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { PageTitle } from '@inseefr/wilco';
import Controls from './controls';
import ConceptGeneral from '../visualization/general';
import CompareNotes from 'js/applications/shared/note-compare';
import { buildNotes } from 'js/utils/concepts/notes';
import { CheckSecondLang } from 'bauhaus-utilities';

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

ConceptCompare.propTypes = {
	id: PropTypes.string.isRequired,
	conceptGeneral: generalPropTypes,
	notes: PropTypes.object.isRequired,
	secondLang: PropTypes.bool.isRequired,
	langs: PropTypes.object.isRequired,
};

export default ConceptCompare;
