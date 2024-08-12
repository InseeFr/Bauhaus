import { useState } from 'react';
import Picker from '../../shared/picker-page';
import D from '../../../i18n';
import ExportButtons from '../../../applications/collections/export-buttons';
import { Loading } from '../../../new-architecture/components';
import {
	useConceptExporter,
	useConcepts,
} from '../../../new-architecture/utils/hooks/concepts';
import { useTitle } from '../../../new-architecture/utils/hooks/useTitle';

const ConceptsToExportContainer = () => {
	useTitle(D.conceptsTitle, D.exportTitle);
	const [ids, setIds] = useState([]);

	const { mutate: exportConcept, isLoading: isExporting } =
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

export default ConceptsToExportContainer;
