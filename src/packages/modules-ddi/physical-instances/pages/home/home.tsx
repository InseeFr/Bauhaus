import { Row } from '@components/layout';
import { Loading } from '@components/loading';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';

import { useTitle } from '@utils/hooks/useTitle';

import { useState } from 'react';
import D from '../../../../deprecated-locales';
import { usePhysicalInstances } from '../../../hooks/usePhysicalInstances';
import {HomePageMenu} from './menu';
import { PhysicalInstanceCreationDialog } from '../../components/PhysicalInstanceCreationDialog';

const formatDate = (dateString: string) => {
	if (!dateString) return '';
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('fr-FR');
	} catch {
		return dateString;
	}
};

export const Component = () => {
	useTitle(D.ddiTitle, D.physicalInstanceTitle);
	const { data = [], isLoading } = usePhysicalInstances();
	const [visible, setVisible] = useState(false);


	const handleSubmit = (data: { label: string; name: string }) => {
		// TODO: Traiter la soumission du formulaire
		console.log(data);
		setVisible(false);
	};

	if (isLoading) return <Loading />;

	return (
		<div className="container">
			<Row>
				<HomePageMenu onCreate={() => setVisible(true)} />
				<div className="col-md-8 text-center pull-right">
					<PageTitle
						title={D.physicalInstancSearcheTitle}
						col={12}
						offset={0}
					/>
					<SearchableList
						items={data}
						childPath="ddi/physical-instances"
						autoFocus
						itemFormatter={(_content: any, item: any) => {
							return `${item.label} (${formatDate(item.versionDate)})`;
						}}
					/>
				</div>
			</Row>

			<PhysicalInstanceCreationDialog
				visible={visible}
				onHide={() => setVisible(false)}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};
