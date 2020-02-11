import React from 'react';
import { withRouter } from 'react-router-dom';
import check from 'js/utils/auth';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';
import { withPermissions } from 'js/components/menu/withPermissions';
import { getLang, Menu } from '@inseefr/ui';
const defaultAttrs = { 'aria-current': 'page' };

export const MenuConcepts = ({ location, permission: { authType, roles } }) => {
	const activePath = location.pathname;
	if (activePath === '/') return null;

	const authImpl = check(authType);
	const adminOrContributor = authImpl.isAdminOrContributor(roles);

	const paths = [
		{
			path: '/concepts/administration',
			pathKey: 'administration',
			className: null,
			attrs: null,
			label: D.administrationTitle,
			order: 4,
			shouldBeDisplayed: adminOrContributor,
			alignToRight: true,
		},
		{
			path: `//inseefr.github.io/Bauhaus/${getLang()}/user-guide/concept.html`,
			pathKey: 'help',
			className: null,
			order: 3,
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

	const currentPath = paths.find(path => {
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

MenuConcepts.propTypes = {
	permission: permissionOverviewPropTypes.isRequired,
};

export default withRouter(withPermissions(MenuConcepts));
