import { Link } from 'react-router-dom';
import dashBoardLogo from '../../../img/dashboard.png';
import D from '../../deprecated-locales';
import './home.scss';
import { useTitle } from '../../utils/hooks/useTitle';
import { PageTitle } from '@components/page-title';

export const Component = () => {
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
};
