import React from 'react';
import ConceptCreateControlLayout from './controls-layout';

function ConceptCreateControl({ handleSave, redirectCancel, errorMessage }) {
	return (
		<ConceptCreateControlLayout
			handleSave={handleSave}
			errors={errorMessage}
			redirectCancel={redirectCancel}
		/>
	);
}

export default ConceptCreateControl;
