import { useLocation } from 'react-router-dom';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { ActionToolbar } from '@components/action-toolbar';
import { ReturnButton } from '@components/buttons/buttons-with-icons';

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
