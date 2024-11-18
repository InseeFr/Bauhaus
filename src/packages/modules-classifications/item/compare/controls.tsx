import { useLocation } from 'react-router-dom';
import D from '../../../deprecated-locales';
import { ActionToolbar } from '@components/action-toolbar';
import { Button } from '@components/buttons/button';

function Controls() {
	const location = useLocation();
	const nexLocation = location.pathname.replace('/compare', '');
	return (
		<ActionToolbar>
			<Button label={D.btnReturnCurrent} action={nexLocation} />
		</ActionToolbar>
	);
}

export default Controls;
