import React from 'react';
import PropTypes from 'prop-types';
import ConceptCreateControlLayout from './controls-layout';
import { propTypes as notesPropTypes } from 'js/utils/concepts/notes';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';

function ConceptCreateControl({
	handleSave,
	redirectCancel,
	errorMessage
}) {

	return (
		<ConceptCreateControlLayout
			handleSave={handleSave}
			errors={errorMessage}
			redirectCancel={redirectCancel}
		/>
	);
}

ConceptCreateControl.propTypes = {
	oldGeneral: generalPropTypes.isRequired,
	general: generalPropTypes.isRequired,
	notes: notesPropTypes.isRequired,
	conceptsWithLinks: conceptsWithLinksPropTypes.isRequired,
	handleSave: PropTypes.func.isRequired,
	redirectCancel: PropTypes.func.isRequired,
};
export default ConceptCreateControl;
