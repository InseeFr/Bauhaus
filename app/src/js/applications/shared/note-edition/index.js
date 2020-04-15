import React from 'react';
import PropTypes from 'prop-types';
import NoteOneLangEdition from './note-one-lang-edition';
import D from 'js/i18n';

function NoteEdition({
	noteLg1,
	handleChangeLg1,
	noteLg2,
	handleChangeLg2,
	maxLength,
	langs,
}) {
	const { lg1, lg2 } = langs;
	return (
		<div>
			<div className="row">
				<div className="col-md-6">
					<NoteOneLangEdition
						lang={lg1}
						note={noteLg1}
						handleChange={handleChangeLg1}
						maxLength={maxLength}
					/>
				</div>
				<div className="col-md-6">
					<NoteOneLangEdition
						lang={lg2}
						note={noteLg2}
						handleChange={handleChangeLg2}
						maxLength={maxLength}
					/>
				</div>
			</div>
			{maxLength && (
				<div className="row">
					<div className="row text-center boldRed">
						{maxLength} {D.scopeNoteChar}
					</div>
				</div>
			)}
		</div>
	);
}

NoteEdition.propTypes = {
	noteLg1: PropTypes.string,
	noteLg2: PropTypes.string,
	handleChangeLg1: PropTypes.func.isRequired,
	handleChangeLg2: PropTypes.func.isRequired,
	maxLength: PropTypes.number, // if not set, unbounded
	langs: PropTypes.object.isRequired,
};

export default NoteEdition;
