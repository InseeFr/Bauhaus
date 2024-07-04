import { useMemo } from 'react';
import D from 'js/i18n';
import { Menu } from '@inseefr/wilco';
import { useLocation } from 'react-router-dom';

const ACTIVE = 'active';
const defaultAttrs = { 'aria-current': 'page' };

const structureMenuItems = {
	components: {
		path: '/structures/components',
		pathKey: /structures\/component/,
		className: null,
		attrs: null,
		order: 2,
		label: D.componentTitle,
	},
	structures: {
		path: '/structures',
		pathKey: /structures/,
		className: null,
		attrs: null,
		order: 1,
		label: D.structuresTitle,
	},
};

const MenuDSDs = () => {
	const location = useLocation();
	const pathname = location.pathname;

	const paths = useMemo(() => {
		const paths = Object.keys(structureMenuItems).reduce((acc, key) => {
			return {
				...acc,
				[key]: {
					...structureMenuItems[key],
					className: '',
					attrs: {},
				},
			};
		}, {});

		for (let key in paths) {
			if (paths[key]['pathKey'].test(pathname)) {
				paths[key]['className'] = ACTIVE;
				paths[key]['attrs'] = defaultAttrs;
				break;
			}
		}

		return paths;
	}, [pathname]);

	return <Menu paths={Object.values(paths)} />;
};

export default MenuDSDs;
