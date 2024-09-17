import { useLocation } from 'react-router-dom';
import { ReturnButton } from '@inseefr/wilco';
import { ActionToolbar } from '../../components/action-toolbar';

const Controls = () => {
	const location = useLocation();
	const nextLocation = location.pathname.replace('/compare', '');
	return (
		<ActionToolbar>
			<ReturnButton action={nextLocation} col={3} />
		</ActionToolbar>
	);
};

export default Controls;
