import { PageTitle } from 'js/new-architecture/components';
import Controls from './controls';
import TabsRmes from 'js/applications/shared/tabs-rmes/tabs-rmes';
import ConceptsSummary from './concepts/summary';
import ConceptsCreationsModifications from './concepts/creations-modifications';
import CollectionsSummary from './collections/summary';
import CollectionsCreationsModifications from './collections/creations-modifications';
import D from 'js/i18n';
import { useTitle } from '../../../../utils';

function ConceptsDashboard({ conceptsData, collectionsData }) {
	useTitle(D.conceptsTitle, D.administrationTitle);
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
					type="creations"
				/>
			),
		},
		{
			title: D.dashboardModificationListTitle,
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
			title: D.dashboardSummaryTitle,
			content: <CollectionsSummary collectionsData={collectionsData} />,
		},
		{
			title: D.dashboardCreationListTitle,
			content: (
				<CollectionsCreationsModifications
					collectionsData={collectionsData}
					type="creations"
				/>
			),
		},
		{
			title: D.dashboardModificationListTitle,
			content: (
				<CollectionsCreationsModifications
					collectionsData={collectionsData}
					type="modifications"
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
