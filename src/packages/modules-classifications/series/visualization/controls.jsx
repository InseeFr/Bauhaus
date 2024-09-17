import { ReturnButton } from '@inseefr/wilco';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { ActionToolbar } from '../../../components/action-toolbar';

function SeriesControls() {
	const goBack = useGoBack();
	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/classifications/series')} />
		</ActionToolbar>
	);
}

export default SeriesControls;
