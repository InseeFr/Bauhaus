import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';

import { loadSetup } from '../../redux/actions/operations/utils/setup';
import Menu from '../menu';
import { useTheme } from '../../utils/hooks/useTheme';

export const Component = () => {
	useTheme('operations');
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(loadSetup());
	}, [dispatch]);

	const location = useLocation();

	return (
		<>
			<Menu location={location} />
			<Outlet />
		</>
	);
};
