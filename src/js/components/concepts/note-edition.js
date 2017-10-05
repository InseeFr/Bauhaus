import React from 'react';
import PropTypes from 'prop-types';
import NoteOneLangEdition from './note-one-lang-edition';
import flagFr from 'js/components/shared/flag-fr';
import flagEn from 'js/components/shared/flag-en';
import { dictionary } from 'js/utils/dictionary';

function NoteEdition({
	noteLg1,
	handleChangeLg1,
	noteLg2,
	handleChangeLg2,
	maxLength,
}) {
	return (
		<div>
			<div className="row">
				<div className="col-md-6">
					<NoteOneLangEdition
						flag={flagFr}
						note={noteLg1}
						handleChange={handleChangeLg1}
						maxLength={maxLength}
					/>
				</div>
				<div className="col-md-6">
					<NoteOneLangEdition
						flag={flagEn}
						note={noteLg2}
						handleChange={handleChangeLg2}
						maxLength={maxLength}
					/>
				</div>
			</div>
			{maxLength && (
				<div className="row">
					<div className="row centered boldRed">
						{maxLength} {dictionary.maxLengthScopeNote}
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
};

export default NoteEdition;
