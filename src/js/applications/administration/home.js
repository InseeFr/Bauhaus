import { Link } from 'react-router-dom';
import dashBoardLogo from '../../../img/dashboard.png';
import { PageTitle } from '../../new-architecture/components';
import D from '../../i18n';
import './home.scss';
import { useTitle } from '../../utils';

function AdministrationHome() {
	useTitle(D.conceptsTitle, D.administrationTitle);
	return (
		<div className="container admin-home">
			<PageTitle title="Administration" />
			<div className="text-center">
				<Link to="/concepts/administration/dashboard">
					<h2 className="page-title page-title-link">{D.dashboardTitle}</h2>
				</Link>
			</div>
			<div className="text-center">
				<Link to="/concepts/administration/dashboard">
					<img src={dashBoardLogo} alt="Dashboard" />
				</Link>
			</div>
		</div>
	);
}

export default AdministrationHome;
