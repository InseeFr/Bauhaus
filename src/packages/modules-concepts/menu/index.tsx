import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { MainMenu } from '@components/menu';

import { UIMenuItem } from '@model/Menu';

import { ADMIN } from '../../auth/roles';
import D from '../../deprecated-locales';
import { getPermission } from '../../redux/selectors';

const defaultAttrs = { 'aria-current': 'page' };

const MenuConcepts = () => {
	const location = useLocation();
	const { roles } = useSelector(getPermission);
	const activePath = location.pathname;
	if (activePath === '/') return null;

	let paths: UIMenuItem[] = [
		{
			path: import.meta.env.VITE_CONCEPTS_DOCUMENTATION,
			pathKey: 'help',
			className: null,
			order: 4,
			attrs: {
				target: '_blank',
			},
			label: D.help,
			alignToRight: true,
		},
		{
			path: '/concepts/collections',
			pathKey: 'collection',
			className: null,
			attrs: null,
			order: 2,
			label: D.collectionsTitle,
		},
		{
			path: '/concepts',
			pathKey: 'concept',
			className: null,
			order: 1,
			label: D.conceptsTitle,
		},
	];

	if (roles.includes(ADMIN)) {
		paths = [
			{
				path: '/concepts/administration',
				pathKey: 'administration',
				className: null,
				attrs: null,
				label: D.administrationTitle,
				order: 3,
				alignToRight: true,
			},
			...paths,
		];
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

export default MenuConcepts;
