import D from '../../deprecated-locales';
import { getLang } from '@inseefr/wilco';
import { useLocation } from 'react-router-dom';
import { MainMenu } from '../../components/menu';

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
			path: `//inseefr.github.io/Bauhaus/${getLang()}/guides/user-guide/concept/`,
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
			path: '/concepts',
			pathKey: 'concept',
			className: null,
			order: 1,
			label: D.conceptsTitle,
		},
		{
			path: '/collections',
			pathKey: 'collection',
			className: null,
			attrs: null,
			order: 2,
			label: D.collectionsTitle,
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
