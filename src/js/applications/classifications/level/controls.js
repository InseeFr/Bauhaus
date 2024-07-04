import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../hooks/hooks';

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
