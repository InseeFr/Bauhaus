import { ActionToolbar, CancelButton, SaveButton } from '@inseefr/wilco';
import { useGoBack } from 'js/hooks/hooks';

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
