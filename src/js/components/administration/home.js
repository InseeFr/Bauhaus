import React from 'react';
import { Link } from 'react-router-dom';
import dashBoardLogo from 'img/dashboard.png';
import adminLogo from 'img/admin.png';
import PageTitle from '../shared/page-title';
import './home.css';

function AdministrationHome() {
	return (
		<div className="container admin-home">
			<PageTitle title="Administration" />
			<div className="img-block">
				<Link to="/administration">
					<h2 className="items page-title page-title-link">Tableau de bord</h2>
				</Link>
				<Link to="/administration">
					<h2 className="items page-title page-title-link">
						Gestion des rôles
					</h2>
				</Link>
			</div>
			<div className="img-block">
				<Link to="/administration">
					<img src={dashBoardLogo} alt="DashBoard" className="img" />
				</Link>
				<Link to="/administration">
					<img src={adminLogo} alt="Roles" className="img" />
				</Link>
			</div>
		</div>
	);
}

export default AdministrationHome;
