import React from 'react';
import { Link } from 'react-router-dom';
import check from 'js/utils/auth/utils';
import dashBoardLogo from 'img/dashboard.png';
import adminLogo from 'img/admin.png';
import PageTitle from '../shared/page-title';
import './home.css';

function AdministrationHome({ permission }) {
	const { authType, role } = permission;
	const authImpl = check(authType);
	const isAdmin = authImpl.isAdmin(role);
	return (
		<div className="container admin-home">
			<PageTitle title="Administration" />
			<div className="img-block">
				<Link to="/concepts/administration/dashboard">
					<h2 className="items page-title page-title-link">Tableau de bord</h2>
				</Link>
				{isAdmin && (
					<Link to="/administration/roles">
						<h2 className="items page-title page-title-link">
							Gestion des habilitations
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
