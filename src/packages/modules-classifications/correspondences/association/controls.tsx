import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../utils/hooks/useGoBack';

type CorrespondenceControlsTypes = {
	correspondenceId?: string;
};
function CorrespondenceControls({
	correspondenceId,
}: Readonly<CorrespondenceControlsTypes>) {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton
				action={() =>
					goBack(`/classifications/correspondence/${correspondenceId}`)
				}
			/>
		</ActionToolbar>
	);
}

export default CorrespondenceControls;
