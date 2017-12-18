import React from 'react';
import PageTitle from 'js/components/shared/page-title';
import Controls from './controls';
import TabsRmes from 'js/components/shared/tabs-rmes';
import ConceptsDashboard from './concepts';
import ClassificationsDashboard from './classifications';
import SourcesDashboard from './sources';
import { dictionary } from 'js/utils/dictionary';

function Dashboard({ conceptSearchList }) {
	const tabs = [
		{
			title: dictionary.navbar.referenciels.concepts,
			content: <ConceptsDashboard conceptsData={conceptSearchList} />,
		},
		{
			title: dictionary.navbar.referenciels.classifications,
			content: <ClassificationsDashboard />,
			disabled: true,
		},
		{
			title: dictionary.navbar.referenciels.sources,
			content: <SourcesDashboard />,
			disabled: true,
		},
	];
	return (
		<div className="container">
			<PageTitle title="Tableau de bord" />
			<Controls />
			<TabsRmes tabs={tabs} />
		</div>
	);
}

export default Dashboard;
