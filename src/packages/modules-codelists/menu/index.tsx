import { UIMenuItem } from '@model/Menu';
import { useLocation } from 'react-router-dom';

import { MainMenu } from '@components/menu';

import { ADMIN } from '../../auth/roles';
import { usePermission } from '../../redux/hooks/usePermission';
import D from '../i18n/build-dictionary';

const defaultAttrs = { 'aria-current': 'page' };

const MenuCodelists = () => {
	const location = useLocation();
	const permission = usePermission();

	const activePath = location.pathname;
	if (activePath === '/') return null;

	const paths: UIMenuItem[] = [
		{
			path: '/codelists',
			pathKey: 'codelists',
			className: null,
			attrs: null,
			label: D.codelistsTitle,
			order: 1,
		},
	];

	if (permission.roles.includes(ADMIN)) {
		paths.unshift({
			path: '/codelists/partial',
			pathKey: 'partial',
			className: null,
			attrs: null,
			label: D.codelistsPartialTitle,
			order: 2,
		});
	}

	const currentPath = paths.find((path) => {
		return location.pathname.includes(path.pathKey);
	});
	if (currentPath) {
		currentPath.className = 'active';
		currentPath.attrs = defaultAttrs;
	}

	return <MainMenu paths={paths} />;
};

export default MenuCodelists;
