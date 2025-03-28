import { ActionToolbar } from '../../../components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '../../../components/buttons/buttons-with-icons';

interface ControlsTypes {
	onSubmit: VoidFunction;
	disabled: boolean;
}
export const Controls = ({ onSubmit, disabled }: Readonly<ControlsTypes>) => {
	return (
		<ActionToolbar>
			<CancelButton action="/operations/operations" />
			<SaveButton action={onSubmit} disabled={disabled} />
		</ActionToolbar>
	);
};
