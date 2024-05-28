import React from 'react';
import ConceptCreateControlLayout from './controls-layout';

function ConceptCreateControl({ handleSave, errorMessage }) {
	return (
		<ConceptCreateControlLayout handleSave={handleSave} errors={errorMessage} />
	);
}

export default ConceptCreateControl;
