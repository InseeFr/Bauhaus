import { useState } from 'react';

import { Exporting, Loading } from '@components/loading';
import { Picker } from '@components/picker-page';

import {
	useCollectionExporter,
	useCollections,
} from '@utils/hooks/collections';
import { useTitle } from '@utils/hooks/useTitle';

import D from '../../../deprecated-locales/build-dictionary';
import ExportButtons from '../export-buttons';

export const Component = () => {
	useTitle(D.collectionsTitle, D.exportTitle);
	const [ids, setIds] = useState<string[]>([]);

	const { data: collections, isLoading } = useCollections();
	const { mutate: exportCollection, isPending: isExporting } =
		useCollectionExporter();

	if (isExporting) return <Exporting />;
	if (isLoading) return <Loading />;

	return (
		<Picker
			items={collections}
			title={D.exportTitle}
			panelTitle={D.collectionsExportPanelTitle}
			labelWarning={D.hasNotCollectionToExport}
			handleAction={(value: string[]) => setIds(value)}
			context="concepts/collections"
			disabled={ids.length < 1}
			disabledWarningMessage={D.hasNotCollectionToExport}
			ValidationButton={() => (
				<ExportButtons
					disabled={ids.length < 1}
					exportHandler={(
						type: string,
						withConcepts: boolean,
						lang: 'lg1' | 'lg2' = 'lg1',
					) => exportCollection({ ids, type, withConcepts, lang })}
				/>
			)}
		/>
	);
};
