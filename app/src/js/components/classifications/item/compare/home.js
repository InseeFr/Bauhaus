import React from 'react';
import PropTypes from 'prop-types';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import PageTitle from 'js/components/shared/page-title';
import Controls from './controls';
import General from '../general';
import CompareNotes from 'js/components/shared/note-compare';
import { buildNotes } from 'js/utils/classifications/classification/notes';

const Compare = ({
	classificationId,
	itemId,
	general,
	notes,
	secondLang,
	saveSecondLang,
	langs,
}) => {
	const { prefLabelLg1, prefLabelLg2 } = general;
	const version = Number(general.conceptVersion);
	return (
		<div>
			<div className="container">
				<CheckSecondLang secondLang={secondLang} onChange={saveSecondLang} />
				<PageTitle
					title={secondLang ? prefLabelLg2 : prefLabelLg1}
					context="classifications"
				/>
				<Controls />
				<General
					general={general}
					classificationId={classificationId}
					itemId={itemId}
					secondLang={secondLang}
				/>
				<CompareNotes
					secondLang={secondLang}
					notes={notes}
					langs={langs}
					version={version}
					buildNotes={buildNotes}
					context="classifications"
				/>
			</div>
		</div>
	);
};

Compare.propTypes = {
	classificationId: PropTypes.string.isRequired,
	itemId: PropTypes.string.isRequired,
	general: PropTypes.object.isRequired,
	notes: PropTypes.object.isRequired,
	secondLang: PropTypes.bool.isRequired,
	saveSecondLang: PropTypes.func.isRequired,
	langs: PropTypes.object.isRequired,
};

export default Compare;
