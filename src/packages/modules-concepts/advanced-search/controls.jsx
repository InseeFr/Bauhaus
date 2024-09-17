import D from '../../deprecated-locales';
import ExportButtons from '../collections/export-buttons';
import { ActionToolbar } from '../../components/action-toolbar';
import { ReturnButton } from '../../components/buttons/buttons-with-icons';
import { Button } from '../../components/buttons/button';

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
					lang
				)
			}
		/>
		<Button
			label={
				<>
					<span className="glyphicon glyphicon-flash" aria-hidden="true" />
					<span> {D.btnReinitialize}</span>
				</>
			}
			action={initializeState}
		/>
	</ActionToolbar>
);

export default Controls;
