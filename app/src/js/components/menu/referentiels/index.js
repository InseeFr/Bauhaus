import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import homeLogo from 'img/accueil.png';
import './referentiels.scss';

function MenuReferentiels() {
	return (
		<header>
			<nav className="navbar navbar-default navbar-default-ref">
				<div className="container-fluid">
					<div className="collapse navbar-collapse">
						<ul className="nav navbar-nav navbar-nav-ref">
							<li>
								<Link to="/">
									<img src={homeLogo} alt="Accueil" className="img-menu" />{' '}
									{D.home}
								</Link>
							</li>
							{process.env.REACT_APP_APPLICATIONS.split(',').map(appName => {
								if (!appName) {
									return;
								}
								const app = appName.trim();
								return (
									<li key={appName}>
										<Link to={'/' + app}>
											<img
												src={require(`img/${app}.jpg`)}
												alt={app}
												className="img-menu"
											/>{' '}
											{D[app + 'Title']}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</nav>
		</header>
	);
}

export default MenuReferentiels;
