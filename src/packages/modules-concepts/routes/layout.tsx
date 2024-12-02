import { Outlet } from 'react-router-dom';

import { useTheme } from '../../utils/hooks/useTheme';
import Menu from '../menu/index';

export const Component = () => {
	useTheme('concepts');
	return (
		<>
			<Menu />
			<Outlet />
		</>
	);
};
