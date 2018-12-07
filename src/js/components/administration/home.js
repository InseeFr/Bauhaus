import React from 'react';
import { Link } from 'react-router-dom';
import check from 'js/utils/auth';
import dashBoardLogo from 'img/dashboard.png';
import adminLogo from 'img/admin.png';
import PageTitle from '../shared/page-title';
import D from 'js/i18n';
import './home.scss';

function AdministrationHome({ permission }) {
	const { authType, roles } = permission;
	const authImpl = check(authType);
	const isAdmin = authImpl.isAdmin(roles);
	return (
		<div className="container admin-home">
			<PageTitle title="Administration" />
			<div className="img-block">
				<Link to="/concepts/administration/dashboard">
					<h2 className="items page-title page-title-link">
						{D.dashboardTitle}
					</h2>
				</Link>
				{isAdmin && (
					<Link to="/administration/roles">
						<h2 className="items page-title page-title-link">
							{D.authorizationManagementTitle}
						</h2>
					</Link>
				)}
			</div>
			<div className="img-block">
				<Link to="/concepts/administration/dashboard">
					<img src={dashBoardLogo} alt="Dashboard" className="img" />
				</Link>
				{isAdmin && (
					<Link to="/administration/roles">
						<img src={adminLogo} alt="Roles" className="img" />
					</Link>
				)}
			</div>
		</div>
	);
}

export default AdministrationHome;
