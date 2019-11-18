import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import homeLogo from 'img/accueil_blanc.svg';
import './referentiels.scss';

function MenuReferentiels() {
	return (
		<header>
			<nav className="navbar navbar-default navbar-secondary">
				<div className="container-fluid">
					<div className="collapse navbar-collapse">
						<ul className="nav navbar-nav">
							<li>
								<Link to="/">
									<img src={homeLogo} alt="Accueil" className="img-menu" />{' '}
									{D.home}
								</Link>
							</li>

							{process.env.REACT_APP_APPLICATIONS.split(',').map(appName => {
								const app = appName.trim();
								if (!app) {
									return null;
								}
								return (
									<li key={`menu-ref-${app}`}>
										<Link to={'/' + app}>
											<img
												src={require(`img/${app}_blanc.svg`)}
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
