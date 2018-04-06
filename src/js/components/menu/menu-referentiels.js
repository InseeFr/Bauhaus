import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import homeLogo from 'img/accueil.png';
import conceptsLogo from 'img/concepts.jpg';
//import nomenclaturesLogo from 'img/nomenclatures.jpg';
import operationsLogo from 'img/operations.jpg';
import './menu-referentiels.css';

function MenuReferentiels() {
	return (
		<div>
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
								<li>
									<Link to="/concepts">
										<img
											src={conceptsLogo}
											alt="Concepts"
											className="img-menu"
										/>{' '}
										{D.conceptsTitle}
									</Link>
								</li>
								{/*<li>
									<Link to="/classifications">
										<img
											src={nomenclaturesLogo}
											alt="Classifications"
											className="img-menu"
										/>{' '}
										{D.classificationsTitle}
									</Link>
								</li>*/}
								<li>
									<Link to="/operations/series">
										<img
											src={operationsLogo}
											alt="Operations"
											className="img-menu"
										/>{' '}
										{D.operationsTitle}
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</header>
		</div>
	);
}

export default MenuReferentiels;
