import { useMemo } from 'react';
import D from '../../deprecated-locales';
import { useLocation } from 'react-router-dom';
import { MainMenu } from '../../components/menu';

const ACTIVE = 'active';
const defaultAttrs = { 'aria-current': 'page' };

type RouterConfig = Record<
	string,
	{
		pathKey: RegExp;
		path: string;
		order: number;
		label: string;
		className: string | null;
		attrs: any | null;
	}
>;

const structureMenuItems: RouterConfig = {
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
} as const;

const MenuDSDs = () => {
	const location = useLocation();
	const pathname = location.pathname;

	const paths: RouterConfig = useMemo(() => {
		const paths = Object.keys(structureMenuItems).reduce(
			(acc: RouterConfig, key) => {
				return {
					...acc,
					[key]: {
						...structureMenuItems[key],
						className: '',
						attrs: {},
					},
				};
			},
			{}
		);

		for (const key in paths) {
			if (paths[key]['pathKey'].test(pathname)) {
				paths[key]['className'] = ACTIVE;
				paths[key]['attrs'] = defaultAttrs;
				break;
			}
		}

		return paths;
	}, [pathname]);

	return <MainMenu paths={Object.values(paths)} />;
};

export default MenuDSDs;
