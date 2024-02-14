import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from '@inseefr/wilco';
import D from '../../../i18n/build-dictionary';

const defaultAttrs = { 'aria-current': 'page' };

const DatasetsMenu = () => {
	const location = useLocation();
	const activePath = location.pathname;
	if (activePath === '/') return null;

	const paths = [
		{
			path: '/datasets/distributions',
			pathKey: 'distributions',
			className: null,
			attrs: null,
			label: D.distributionsTitle,
			order: 2,
		},
		{
			path: '/datasets',
			pathKey: 'datasets',
			className: null,
			attrs: null,
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

	return <Menu paths={paths} />;
};

export default DatasetsMenu;
