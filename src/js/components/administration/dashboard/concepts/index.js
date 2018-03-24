import React from 'react';
import PageTitle from 'js/components/shared/page-title';
import Controls from '../controls';
import TabsRmes from 'js/components/shared/tabs-rmes';
import ConceptsSummary from './concepts/summary';
import ConceptsCreationsModifications from './concepts/creations-modifications';
import CollectionsSummary from './collections/summary';
import CollectionsCreationsModifications from './collections/creations-modifications';
import D from 'js/i18n';

function ConceptsDashboard({ conceptsData, collectionsData }) {
	const tabsConcepts = [
		{
			title: D.dashboardSummaryTitle,
			content: <ConceptsSummary conceptsData={conceptsData} />,
		},
		{
			title: D.dashboardCreationListTitle,
			content: (
				<ConceptsCreationsModifications
					conceptsData={conceptsData}
					type={D.creationsTitle}
				/>
			),
		},
		{
			title: D.dashboardModificationListTitle,
			content: (
				<ConceptsCreationsModifications
					conceptsData={conceptsData}
					type={D.modificationsTitle}
				/>
			),
		},
	];
	const tabsCollections = [
		{
			title: D.dashboardSummaryTitle,
			content: <CollectionsSummary collectionsData={collectionsData} />,
		},
		{
			title: D.dashboardCreationListTitle,
			content: (
				<CollectionsCreationsModifications
					collectionsData={collectionsData}
					type={D.creationsTitle}
				/>
			),
		},
		{
			title: D.dashboardModificationListTitle,
			content: (
				<CollectionsCreationsModifications
					collectionsData={collectionsData}
					type={D.modificationsTitle}
				/>
			),
		},
	];
	const tabs = [
		{ title: D.conceptsTitle, content: <TabsRmes tabs={tabsConcepts} /> },
		{ title: D.collectionsTitle, content: <TabsRmes tabs={tabsCollections} /> },
	];
	return (
		<div className="container">
			<PageTitle title={D.dashboardConceptsTitle} />
			<Controls />
			<TabsRmes tabs={tabs} />
		</div>
	);
}

export default ConceptsDashboard;
