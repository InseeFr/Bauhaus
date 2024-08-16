import { useState } from 'react';
import D from '../../../deprecated-locales/build-dictionary';
import ExportButtons from '../export-buttons';
import { Loading, Picker } from '../../../components';
import {
	useCollectionExporter,
	useCollections,
} from '../../../utils/hooks/collections';
import { useTitle } from '../../../utils/hooks/useTitle';

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
