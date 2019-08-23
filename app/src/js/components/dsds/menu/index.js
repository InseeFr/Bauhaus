import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuReferentiels from 'js/components/menu/referentiels';
import D from 'js/i18n';
import './dsds.scss';

const MenuDSDs = () => {
	const [menuRef, setMenuRef] = useState(false);

	return (
		<div>
			<header>
				<nav className="navbar navbar-default-dsds">
					<div className="container-fluid">
						<div className="collapse navbar-collapse">
							<ul className="nav navbar-nav navbar-nav-dsds">
								<li>
									<button onClick={() => setMenuRef(!menuRef)}>
										<span className="glyphicon glyphicon-th navbar-icon inline" />
										<span className="inline"> {D.repositoryNavigation}</span>
									</button>
								</li>
								<li className="active">
									<Link to={'/dsds'}>{D.dsdsTitle}</Link>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</header>
			{menuRef && <MenuReferentiels />}
		</div>
	);
};

export default MenuDSDs;
