import React from 'react';
import D from 'js/i18n';
import { Menu } from '@inseefr/wilco';

const MenuDSDs = () => {
	const paths = [
		{
			path: '/structures',
			pathKey: 'structures',
			className: 'active',
			attrs: { 'aria-current': 'page' },
			label: D.structuresTitle,
			order: 1,
		},
	];
	return <Menu paths={paths} />;
};

export default MenuDSDs;
