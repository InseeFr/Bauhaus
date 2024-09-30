import { Outlet } from 'react-router-dom';

import Menu from '../menu/index';
import { useTheme } from '../../utils/hooks/useTheme';

export const Component = () => {
	useTheme('concepts');
	return (
		<>
			<Menu />
			<Outlet />
		</>
	);
};
