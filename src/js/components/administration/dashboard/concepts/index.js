import React from 'react';
import PageTitle from 'js/components/shared/page-title';
import Controls from '../controls';
import TabsRmes from 'js/components/shared/tabs-rmes';
import ConceptsSummary from './concepts/summary';
import ConceptsCreationsModifications from './concepts/creations-modifications';
import CollectionsSummary from './collections/summary';
import CollectionsCreationsModifications from './collections/creations-modifications';

function ConceptsDashboard({ conceptsData, collectionsData }) {
	const tabsConcepts = [
		{
			title: 'Récapitulatif',
			content: <ConceptsSummary conceptsData={conceptsData} />,
		},
		{
			title: 'Liste des créations',
			content: (
				<ConceptsCreationsModifications
					conceptsData={conceptsData}
					type="creations"
				/>
			),
		},
		{
			title: 'Liste des modifications',
			content: (
				<ConceptsCreationsModifications
					conceptsData={conceptsData}
					type="modifications"
				/>
			),
		},
	];
	const tabsCollections = [
		{
			title: 'Récapitulatif',
			content: <CollectionsSummary collectionsData={collectionsData} />,
		},
		{
			title: 'Liste des créations',
			content: (
				<CollectionsCreationsModifications
					collectionsData={collectionsData}
					type="creations"
				/>
			),
		},
		{
			title: 'Liste des modifications',
			content: (
				<CollectionsCreationsModifications
					collectionsData={collectionsData}
					type="modifications"
				/>
			),
		},
	];
	const tabs = [
		{ title: 'Concepts', content: <TabsRmes tabs={tabsConcepts} /> },
		{ title: 'Collections', content: <TabsRmes tabs={tabsCollections} /> },
	];
	return (
		<div className="container">
			<PageTitle title="Tableau de bord des concepts" />
			<Controls />
			<TabsRmes tabs={tabs} />
		</div>
	);
}

export default ConceptsDashboard;
