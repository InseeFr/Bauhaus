import { Outlet } from 'react-router-dom';

import Menu from '../menu';
import { useTheme } from '../../utils/hooks/useTheme';

export const Component = () => {
	useTheme('classifications');
	return (
		<>
			<Menu />
			<Outlet />
		</>
	);
};
