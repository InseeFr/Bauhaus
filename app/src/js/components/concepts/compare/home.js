import React from 'react';
import PropTypes from 'prop-types';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import PageTitle from 'js/components/shared/page-title';
import Controls from './controls';
import ConceptGeneral from '../visualization/general';
import CompareNotes from 'js/components/shared/note-compare';
import { buildNotes } from 'js/utils/concepts/notes';

const ConceptCompare = ({
	id,
	conceptGeneral,
	notes,
	secondLang,
	saveSecondLang,
	langs,
}) => {
	const { prefLabelLg1, prefLabelLg2 } = conceptGeneral;
	const version = Number(conceptGeneral.conceptVersion);
	return (
		<div>
			<div className="container">
				<PageTitle title={secondLang ? prefLabelLg2 : prefLabelLg1} />
				<Controls />
				<CheckSecondLang secondLang={secondLang} onChange={saveSecondLang} />

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
	saveSecondLang: PropTypes.func.isRequired,
	langs: PropTypes.object.isRequired,
};

export default ConceptCompare;
