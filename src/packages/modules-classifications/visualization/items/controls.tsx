import { useLocation } from 'react-router-dom';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { ActionToolbar } from '@components/action-toolbar';
import { ReturnButton } from '@components/buttons/buttons-with-icons';

function ClassificationControls() {
	const goBack = useGoBack();
	const location = useLocation();
	const nextLocation = location.pathname.replace('/items', '');

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack(nextLocation)} />
		</ActionToolbar>
	);
}

export default ClassificationControls;
