import { PageTitle, Tabs } from '../../../../components';
import Controls from './controls';
import ConceptsSummary from './concepts/summary';
import ConceptsCreationsModifications from './concepts/creations-modifications';
import CollectionsSummary from './collections/summary';
import CollectionsCreationsModifications from './collections/creations-modifications';
import D from '../../../../deprecated-locales';
import { useTitle } from '../../../../utils/hooks/useTitle';

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
		{ title: D.conceptsTitle, content: <Tabs tabs={tabsConcepts} /> },
		{ title: D.collectionsTitle, content: <Tabs tabs={tabsCollections} /> },
	];
	return (
		<div className="container">
			<PageTitle title={D.dashboardConceptsTitle} />
			<Controls />
			<Tabs tabs={tabs} />
		</div>
	);
}

export default ConceptsDashboard;
