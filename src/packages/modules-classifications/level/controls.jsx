import { ReturnButton } from '@inseefr/wilco';
import { useGoBack } from '../../utils/hooks/useGoBack';
import { ActionToolbar } from '../../components/action-toolbar';

function LevelControls({ id }) {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton
				action={() => goBack(`/classifications/classification/${id}`)}
			/>
		</ActionToolbar>
	);
}

export default LevelControls;
