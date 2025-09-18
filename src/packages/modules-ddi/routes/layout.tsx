import { Outlet } from 'react-router-dom';

import { useTheme } from '../../utils/hooks/useTheme';
import {Menu} from '../menu';

export const Component = () => {
	useTheme('ddi');
	return (
		<>
			<Menu />
			<div className="container">
				<Outlet />
			</div>
		</>
	);
};
