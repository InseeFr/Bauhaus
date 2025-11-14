import { useLocation } from 'react-router-dom';

import { MainMenu } from '@components/menu';

import { UIMenuItem } from '@model/Menu';

import { useAuthorizationGuard } from '../../auth/components/auth';
import D from '../i18n/build-dictionary';

const defaultAttrs = { 'aria-current': 'page' };

const MenuCodelists = () => {
	const location = useLocation();

	const activePath = location.pathname;
	if (activePath === '/') return null;

	const canAccessAdministration = useAuthorizationGuard({
		module: 'CODESLIST_CODESLIST',
		privilege: 'READ',
	});

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

	if (canAccessAdministration) {
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
