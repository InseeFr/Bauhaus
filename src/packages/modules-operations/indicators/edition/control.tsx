import { useGoBack } from '@utils/hooks/useGoBack';
import { ActionToolbar } from '@components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '@components/buttons/buttons-with-icons';

type ControlTypes = {
	onSubmit: () => void;
	disabled?: boolean;
};

function Control({ onSubmit, disabled }: Readonly<ControlTypes>) {
	const goBack = useGoBack();

	return (
		<ActionToolbar>
			<CancelButton action={() => goBack('/operations/indicators')} />
			<SaveButton action={onSubmit} disabled={disabled} />
		</ActionToolbar>
	);
}

export default Control;
