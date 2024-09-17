import { useLocation } from 'react-router-dom';
import { Button } from '@inseefr/wilco';
import D from '../../../deprecated-locales';
import { ActionToolbar } from '../../../components/action-toolbar';

function Controls() {
	const location = useLocation();
	const nexLocation = location.pathname.replace('/compare', '');
	return (
		<ActionToolbar>
			<Button label={D.btnReturnCurrent} action={nexLocation} col={3} />
		</ActionToolbar>
	);
}

export default Controls;
