import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';

import { Loading } from '@components/loading';

import { useTheme } from '@utils/hooks/useTheme';

import { loadSetup } from '../../redux/actions/operations/utils/setup';
import Menu from '../menu';

export const Component = () => {
	useTheme('operations');
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const location = useLocation();

	useEffect(() => {
		dispatch(loadSetup());
	}, [dispatch]);

	return (
		<>
			<Menu location={location} />
			{navigation.state === 'loading' ? <Loading /> : <Outlet />}
		</>
	);
};
