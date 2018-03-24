import React from 'react';
import ConceptDetailsContainer from './concept-details-container';
import ConceptEditionCreation from './edition-creation';
import ConceptVisualization from './concept-visualization';
import createConcept from 'js/actions/concepts/create';
import D from 'js/i18n';

//TODO does not seem to work when the creation page is requestion without
//visiting first the concepts page
//TODO creation, validation and update should be constants
export const ConceptCreation = () => (
	<ConceptDetailsContainer
		handleAction={createConcept}
		statusPropName="creation"
	>
		{({
			general,
			notes,
			conceptsWithLinks,
			stampList,
			disseminationStatusList,
			id,
			handleAction,
			trackAction,
		}) => {
			//TODO fix me
			return (
				<ConceptEditionCreation
					id={id}
					creation
					title={D.createConceptTitle}
					general={general}
					notes={notes}
					conceptsWithLinks={conceptsWithLinks}
					disseminationStatusList={disseminationStatusList}
					stampList={stampList}
					isActionProcessed={trackAction}
					save={handleAction}
				/>
			);
		}}
	</ConceptDetailsContainer>
);

export { ConceptVisualization };
