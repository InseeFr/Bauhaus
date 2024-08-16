import { Menu } from '@inseefr/wilco';
import D from '../i18n/build-dictionary';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getPermission } from '../../redux/selectors';
import { ADMIN } from '../../auth/roles';

const defaultAttrs = { 'aria-current': 'page' };

const MenuCodelists = () => {
	const location = useLocation();
	const permission = useSelector((state) => getPermission(state));

	const activePath = location.pathname;
	if (activePath === '/') return null;

	const paths = [
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
			path: '/codelists-partial',
			pathKey: 'codelists-partial',
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

	return <Menu paths={paths} />;
};

export default MenuCodelists;
