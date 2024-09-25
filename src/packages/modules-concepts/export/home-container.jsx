import { useState } from 'react';
import D from '../../deprecated-locales';
import ExportButtons from '../collections/export-buttons';
import { Loading, Picker } from '../../components';
import { useConceptExporter, useConcepts } from '../../utils/hooks/concepts';
import { useTitle } from '../../utils/hooks/useTitle';

export const Component = () => {
	useTitle(D.conceptsTitle, D.exportTitle);
	const [ids, setIds] = useState([]);

	const { mutate: exportConcept, isPending: isExporting } =
		useConceptExporter();
	const { isLoading, data: concepts } = useConcepts();

	if (isExporting) {
		return <Loading textType="exporting" />;
	}
	if (isLoading) {
		return <Loading />;
	}

	return (
		<Picker
			items={concepts}
			title={D.exportTitle}
			panelTitle={D.conceptsExportPanelTitle}
			labelWarning={D.hasNotConceptToExport}
			handleAction={(value) => setIds(value)}
			context="concepts"
			disabled={ids.length < 1}
			disabledWarningMessage={D.hasNotConceptToExport}
			ValidationButton={() => (
				<ExportButtons
					ids={ids}
					exportHandler={(type, withConcepts, lang = 'lg1') =>
						exportConcept({ ids, type, withConcepts, lang })
					}
					disabled={ids.length < 1}
				/>
			)}
		/>
	);
};
