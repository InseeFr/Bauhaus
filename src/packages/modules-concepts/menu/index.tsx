import { useLocation } from 'react-router-dom';

import { MainMenu } from '@components/menu';

import D from '../../deprecated-locales';

const defaultAttrs = { 'aria-current': 'page' };

const MenuConcepts = () => {
	const location = useLocation();
	const activePath = location.pathname;

	if (activePath === '/') return null;

	const paths = [
		{
			path: '/concepts/administration',
			pathKey: 'administration',
			className: null,
			attrs: null,
			label: D.administrationTitle,
			order: 3,
			alignToRight: true,
		},
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
