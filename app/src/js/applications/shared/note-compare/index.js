import React, { useState } from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { ExplanatoryNote } from 'js/applications/shared/explanatory-note';
import {
	creatSelectList,
	creatSelectListSelectedLast,
} from 'js/utils/array-utils';

const CompareNotes = ({ secondLang,
												notes,
												langs: { lg1, lg2 },
												version,
												buildNotes }) => {
	const [firstChoice, setFirstChoice] = useState(version - 1);
	const [secondChoice, setSecondChoice] = useState(version)

	const changeFirstChoice = (e) => setFirstChoice(e.target.value);
	const changeSecondChoice = (e) => setSecondChoice(e.target.value);

	const notesVersion1 = buildNotes(notes[firstChoice]);
	const notesVersion2 = buildNotes(notes[secondChoice]);

	return (
		<div>
			<div className="row">
				<div className="col-md-6 text-center">
					<h3>
						{' '}
						{D.version} :{' '}
						<select
							value={firstChoice}
							onChange={changeFirstChoice}
						>
							{creatSelectList(version)}
						</select>
					</h3>
				</div>
				<div className="col-md-6 text-center">
					<h3>
						{' '}
						{D.version} :{' '}
						<select
							value={secondChoice}
							onChange={changeSecondChoice}
						>
							{creatSelectListSelectedLast(version)}
						</select>
					</h3>
				</div>
			</div>
			{notesVersion2.map((n, i) => (
				<div className="row" key={`notes-compare-${i}`}>
					<ExplanatoryNote
						text={
							secondLang ? notesVersion1[i]['lg2'] : notesVersion1[i]['lg1']
						}
						title={D[notesVersion1[i].title]}
						lang={secondLang ? lg2 : lg1}
						alone={false}
					/>
					<ExplanatoryNote
						text={secondLang ? n.lg2 : n.lg1}
						title={D[n.title]}
						lang={secondLang ? lg2 : lg1}
						alone={false}
					/>
				</div>
			))}
		</div>
	);
}

CompareNotes.propTypes = {
	secondLang: PropTypes.bool.isRequired,
	notes: PropTypes.object.isRequired,
	langs: PropTypes.object.isRequired,
	version: PropTypes.number.isRequired,
	buildNotes: PropTypes.func.isRequired,
};

export default CompareNotes;
