import React from 'react';
import { useLocation } from 'react-router-dom';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';

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
