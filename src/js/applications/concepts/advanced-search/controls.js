import { Button, ActionToolbar, ReturnButton } from '@inseefr/wilco';
import D from 'js/i18n';
import ExportButtons from '../../collections/export-buttons';

export default ({ onClickReturn, initializeState, onExport, conceptsList }) => (
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
