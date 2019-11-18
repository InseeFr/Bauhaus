import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';

const MenuDSDs = () => {
	return (
		<div>
			<header>
				<nav className="navbar navbar-primary">
					<div className="container-fluid">
						<div className="collapse navbar-collapse">
							<ul className="nav navbar-nav navbar-nav">
								<li>
									<Link to="/">{D.home}</Link>
								</li>
								<li className="active">
									<Link to={'/dsds'} aria-current="page">
										{D.dsdsTitle}
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</header>
		</div>
	);
};

export default MenuDSDs;
