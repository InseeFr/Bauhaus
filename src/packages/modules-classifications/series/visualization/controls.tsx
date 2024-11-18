import { ActionToolbar } from '@components/action-toolbar';
import { ReturnButton } from '@components/buttons/buttons-with-icons';

import { useGoBack } from '@utils/hooks/useGoBack';

function SeriesControls() {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/classifications/series')} />
		</ActionToolbar>
	);
}

export default SeriesControls;
