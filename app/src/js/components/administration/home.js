import React from 'react';
import { Link } from 'react-router-dom';
import dashBoardLogo from 'img/dashboard.png';
import PageTitle from '../shared/page-title';
import D from 'js/i18n';
import './home.scss';

function AdministrationHome() {
	return (
		<div className="container admin-home">
			<PageTitle title="Administration" />
			<div className="img-block">
				<Link to="/concepts/administration/dashboard">
					<h2 className="items page-title page-title-link">
						{D.dashboardTitle}
					</h2>
				</Link>
			</div>
			<div className="img-block">
				<Link to="/concepts/administration/dashboard">
					<img src={dashBoardLogo} alt="Dashboard" className="img" />
				</Link>
			</div>
		</div>
	);
}

export default AdministrationHome;
