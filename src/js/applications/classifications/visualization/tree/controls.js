import { useLocation } from 'react-router-dom';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useGoBack } from '../../../../hooks/hooks';

function ClassificationControls() {
	const location = useLocation();
	const goBack = useGoBack();
	const nextLocation = location.pathname.replace('/tree', '');

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack(nextLocation)} />
		</ActionToolbar>
	);
}

export default ClassificationControls;
