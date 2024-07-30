import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';

function CorrespondenceControls({ correspondenceId }) {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton
				action={() =>
					goBack(`/classifications/correspondence/${correspondenceId}`)
				}
			/>
			lol
		</ActionToolbar>
	);
}

export default CorrespondenceControls;
