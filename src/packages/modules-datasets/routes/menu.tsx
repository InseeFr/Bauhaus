import { UIMenuItem } from '@model/Menu';
import { useLocation } from 'react-router-dom';

import { MainMenu } from '@components/menu';

import D from '../../deprecated-locales/build-dictionary';

const defaultAttrs = { 'aria-current': 'page' };

const DatasetsMenu = () => {
	const location = useLocation();
	const activePath = location.pathname;
	if (activePath === '/') return null;

	const paths: UIMenuItem[] = [
		{
			path: '/datasets/distributions',
			pathKey: 'distributions',
			className: {},
			attrs: {},
			label: D.distributionsTitle,
			order: 2,
		},
		{
			path: '/datasets',
			pathKey: 'datasets',
			className: {},
			attrs: {},
			label: D.datasetsTitle,
			order: 1,
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

export default DatasetsMenu;
