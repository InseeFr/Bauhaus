import React from 'react';
import D from 'js/i18n';
import { Menu } from '@inseefr/wilco';

const MenuDSDs = () => {
	const paths = [
		{
			path: '/dsds',
			pathKey: 'dsds',
			className: 'active',
			attrs: { 'aria-current': 'page' },
			label: D.dsdsTitle,
			order: 1,
		},
	];
	return <Menu paths={paths} />;
};

export default MenuDSDs;
