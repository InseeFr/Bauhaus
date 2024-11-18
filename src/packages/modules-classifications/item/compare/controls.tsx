import { useLocation } from 'react-router-dom';

import { ActionToolbar } from '@components/action-toolbar';
import { Button } from '@components/buttons/button';

import D from '../../../deprecated-locales';

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
