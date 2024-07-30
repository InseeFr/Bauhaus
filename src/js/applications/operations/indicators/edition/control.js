import { ActionToolbar, CancelButton, SaveButton } from '@inseefr/wilco';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';

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
