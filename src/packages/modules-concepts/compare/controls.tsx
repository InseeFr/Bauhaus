import { useLocation } from 'react-router-dom';
import { ActionToolbar } from '@components/action-toolbar';
import { ReturnButton } from '@components/buttons/buttons-with-icons';

const Controls = () => {
	const location = useLocation();
	const nextLocation = location.pathname.replace('/compare', '');
	return (
		<ActionToolbar>
			<ReturnButton action={nextLocation} />
		</ActionToolbar>
	);
};

export default Controls;
