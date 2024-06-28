import { useState } from 'react';
import { useTitle } from 'js/utils';
import D from '../../../i18n/build-dictionary';
import Picker from '../../shared/picker-page';
import ExportButtons from '../export-buttons';
import { Loading } from 'js/new-architecture/components/loading/loading';
import {
	useCollectionExporter,
	useCollections,
} from 'js/new-architecture/utils/hooks/collections';

const CollectionsToExportContainer = () => {
	useTitle(D.collectionsTitle, D.exportTitle);
	const [ids, setIds] = useState([]);

	const { data: collections, isLoading } = useCollections();
	const { mutate: exportCollection, isLoading: isExporting } =
		useCollectionExporter();

	if (isExporting) return <Loading textType="exporting" />;
	if (isLoading) return <Loading />;

	return (
		<Picker
			items={collections}
			title={D.exportTitle}
			panelTitle={D.collectionsExportPanelTitle}
			labelWarning={D.hasNotCollectionToExport}
			handleAction={(value) => setIds(value)}
			context="collections"
			disabled={ids.length < 1}
			disabledWarningMessage={D.hasNotCollectionToExport}
			ValidationButton={() => (
				<ExportButtons
					ids={ids}
					disabled={ids.length < 1}
					exportHandler={(type, withConcepts, lang = 'lg1') =>
						exportCollection({ ids, type, withConcepts, lang })
					}
				/>
			)}
		/>
	);
};

export default CollectionsToExportContainer;
