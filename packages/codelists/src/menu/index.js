import React from 'react';
import { withRouter } from 'react-router-dom';
import { Menu } from '@inseefr/wilco';
import D from '../i18n/build-dictionary';
import { Auth } from 'bauhaus-utilities';
import { useSelector } from 'react-redux';

const defaultAttrs = { 'aria-current': 'page' };

const MenuCodelists = ({ location }) => {
	const permission = useSelector((state) => Auth.getPermission(state));

	const activePath = location.pathname;
	if (activePath === '/') return null;

	const paths = [
		{
			path: '/codelists',
			pathKey: 'codelists',
			className: null,
			attrs: null,
			label: D.codelistsTitle,
			order: 1,
		},
	];

	if (permission.roles.includes(Auth.ADMIN)) {
		paths.push({
			path: '/codelists-partial',
			pathKey: 'codelists-partial',
			className: null,
			attrs: null,
			label: D.codelistsPartialTitle,
			order: 2,
		});
	}

	const currentPath = paths.find((path) => {
		return location.pathname.includes(path.pathKey);
	});
	if (currentPath) {
		currentPath.className = 'active';
		currentPath.attrs = defaultAttrs;
	}

	return <Menu paths={paths} />;
};

export default withRouter(MenuCodelists);
