import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';

function FamilyControls() {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/classifications/families')} />
		</ActionToolbar>
	);
}

export default FamilyControls;
