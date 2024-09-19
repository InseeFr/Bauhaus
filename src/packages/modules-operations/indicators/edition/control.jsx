import { useGoBack } from '../../../utils/hooks/useGoBack';
import { ActionToolbar } from '../../../components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '../../../components/buttons/buttons-with-icons';

function Control({ onSubmit, disabled }) {
	const goBack = useGoBack();

	return (
		<ActionToolbar>
			<CancelButton action={() => goBack('/operations/indicators')} />
			<SaveButton action={onSubmit} disabled={disabled} />
		</ActionToolbar>
	);
}

export default Control;
