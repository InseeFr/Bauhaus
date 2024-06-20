import React from 'react';
import D from 'js/i18n';
import { getLang, Menu } from '@inseefr/wilco';
import { useLocation } from 'react-router-dom';
const defaultAttrs = { 'aria-current': 'page' };

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
		path: `//inseefr.github.io/Bauhaus/${getLang()}/user-guide/concept.html`,
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

const MenuConcepts = () => {
	const location = useLocation();
	const activePath = location.pathname;
	if (activePath === '/') return null;

	const currentPath = paths.find((path) => {
		return location.pathname.includes(path.pathKey);
	});
	if (currentPath) {
		currentPath.className = 'active';
		currentPath.attrs = {
			...currentPath.attrs,
			...defaultAttrs,
		};
	}

	return <Menu paths={paths} />;
};

export default MenuConcepts;
