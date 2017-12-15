import React from 'react';
import PropTypes from 'prop-types';
import ConceptDetailsContainer from './concept-details-container';
import ConceptEditionCreation from './edition-creation';
import ConceptVisualization from './concept-visualization';
import PageTitle from 'js/components/shared/page-title';
import createConcept from 'js/actions/concepts/create';
import updateConcept from 'js/actions/concepts/update';
import buildExtract from 'js/utils/build-extract';
import { dictionary } from 'js/utils/dictionary';

const extractId = buildExtract('id');

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
			const pageTitle = <PageTitle title={dictionary.concept.create} />;
			return (
				<ConceptEditionCreation
					id={id}
					creation
					pageTitle={pageTitle}
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
