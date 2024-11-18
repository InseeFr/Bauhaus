import { ActionToolbar } from '@components/action-toolbar';
import { ReturnButton } from '@components/buttons/buttons-with-icons';

import { useGoBack } from '../../utils/hooks/useGoBack';

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
