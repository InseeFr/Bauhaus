import { useLocation } from 'react-router-dom';
import D from '../../deprecated-locales';
import { MainMenu } from '@components/menu';
const defaultAttrs = { 'aria-current': 'page' };

const MenuClassifications = () => {
	const location = useLocation();
	const activePath = location.pathname;
	if (activePath === '/') return null;

	const paths = [
		{
			path: '/classifications/families',
			pathKey: 'classifications/famil',
			className: null,
			attrs: null,
			label: D.familiesTitle,
			order: 0,
		},
		{
			path: '/classifications/series',
			pathKey: 'classifications/series',
			className: null,
			attrs: null,
			label: D.seriesTitle,
			order: 1,
		},
		{
			path: '/classifications/correspondences',
			pathKey: 'classifications/correspondence',
			className: null,
			attrs: null,
			label: D.correspondencesTitle,
			order: 3,
		},
		{
			path: '/classifications',
			pathKey: 'classification',
			className: null,
			attrs: null,
			label: D.classificationsTitle,
			order: 2,
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

export default MenuClassifications;
