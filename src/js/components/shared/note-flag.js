import React from 'react';
import flag from 'js/components/shared/flag';
import PropTypes from 'prop-types';

function NoteFlag({ text, lang }) {
	return (
		<React.Fragment>
			{text + '  ( '}
			{flag(lang)} )
		</React.Fragment>
	);
}

NoteFlag.propTypes = {
	text: PropTypes.string,
	lang: PropTypes.string,
};

export default NoteFlag;
