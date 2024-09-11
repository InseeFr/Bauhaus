import { useLocation } from 'react-router-dom';
import { Button, ActionToolbar } from '@inseefr/wilco';
import D from '../../../deprecated-locales';

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
