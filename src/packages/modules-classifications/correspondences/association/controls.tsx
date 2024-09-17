import { ReturnButton } from '@inseefr/wilco';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { ActionToolbar } from '../../../components/action-toolbar';

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
