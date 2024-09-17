import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../utils/hooks/useGoBack';

function SeriesControls() {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/classifications/series')} />
		</ActionToolbar>
	);
}

export default SeriesControls;
