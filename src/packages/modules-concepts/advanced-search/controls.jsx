import { ActionToolbar } from '@components/action-toolbar';
import {
	ResetButton,
	ReturnButton,
} from '@components/buttons/buttons-with-icons';

import ExportButtons from '../collections/export-buttons';

const Controls = ({
	onClickReturn,
	initializeState,
	onExport,
	conceptsList,
}) => (
	<ActionToolbar>
		<ReturnButton action={onClickReturn} />
		<ExportButtons
			offset={6}
			ids={conceptsList.map((c) => c.id)}
			exporting={() => {}}
			exportHandler={(type, withConcepts, lang) =>
				onExport(
					conceptsList.map((c) => c.id),
					type,
					withConcepts,
					lang,
				)
			}
		/>
		<ResetButton action={initializeState} />
	</ActionToolbar>
);

export default Controls;
