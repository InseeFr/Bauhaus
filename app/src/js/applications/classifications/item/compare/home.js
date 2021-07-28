import React from 'react';
import PropTypes from 'prop-types';
import { PageTitle } from '@inseefr/wilco';
import Controls from './controls';
import General from '../general';
import CompareNotes from 'js/applications/shared/note-compare';
import { buildNotes } from 'js/applications/classifications/utils/classification/notes';
import { CheckSecondLang } from 'bauhaus-utilities';

const Compare = ({
	classificationId,
	itemId,
	general,
	notes,
	secondLang,
	langs,
}) => {
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

Compare.propTypes = {
	classificationId: PropTypes.string.isRequired,
	itemId: PropTypes.string.isRequired,
	general: PropTypes.object.isRequired,
	notes: PropTypes.object.isRequired,
	secondLang: PropTypes.bool.isRequired,
	langs: PropTypes.object.isRequired,
};

export default Compare;
