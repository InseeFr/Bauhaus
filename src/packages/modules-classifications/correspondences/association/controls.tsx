import { ActionToolbar } from '@components/action-toolbar';
import { ReturnButton } from '@components/buttons/buttons-with-icons';

import { useGoBack } from '@utils/hooks/useGoBack';

interface CorrespondenceControlsTypes {
	correspondenceId?: string;
}
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
