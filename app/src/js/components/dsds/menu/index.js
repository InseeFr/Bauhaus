import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuReferentiels from 'js/components/menu/referentiels';
import D from 'js/i18n';

const MenuDSDs = () => {
	const [menuRef, setMenuRef] = useState(false);

	return (
		<div>
			<header>
				<nav className="navbar navbar-primary">
					<div className="container-fluid">
						<div className="collapse navbar-collapse">
							<ul className="nav navbar-nav navbar-nav">
								<li>
									<Link
										to="/"
										onClick={e => {
											e.preventDefault();
											setMenuRef(!menuRef);
										}}
									>
										{D.repositoryNavigation}
									</Link>
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
			{menuRef && <MenuReferentiels />}
		</div>
	);
};

export default MenuDSDs;
