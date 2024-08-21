import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../utils/hooks/useGoBack';

function CorrespondenceControls() {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/classifications/correspondences')} />
		</ActionToolbar>
	);
}

export default CorrespondenceControls;
