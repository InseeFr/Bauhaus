import { ReturnButton } from '@inseefr/wilco';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { ActionToolbar } from '../../../components/action-toolbar';

function FamilyControls() {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/classifications/families')} />
		</ActionToolbar>
	);
}

export default FamilyControls;
