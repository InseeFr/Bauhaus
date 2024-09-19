import ConceptCreateControlLayout from './controls-layout';

function ConceptCreateControl({ handleSave, errorMessage, submitting }) {
	return (
		<ConceptCreateControlLayout
			handleSave={handleSave}
			errors={errorMessage}
			submitting={submitting}
		/>
	);
}

export default ConceptCreateControl;
