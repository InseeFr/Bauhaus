import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../utils/hooks/useGoBack';

function FamilyControls() {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/classifications/families')} />
		</ActionToolbar>
	);
}

export default FamilyControls;
