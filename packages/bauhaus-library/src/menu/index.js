import React, { useContext } from 'react';
import { I18NContext } from '../context';

import { Link } from 'react-router-dom';

import './menu.scss';

function getClasses(path) {
	if (path.alignToRight) {
		return [path.className, 'navbar-right'].join(' ');
	}
	return path.className;
}
export default ({ paths }) => {
	const D = useContext(I18NContext);

	return (
		<header>
			<nav className="navbar navbar-primary">
				<div className="container-fluid">
					<div className="collapse navbar-collapse">
						<ul className="nav navbar-nav">
							<li>
								<Link to="/">{D.home}</Link>
							</li>
							{paths
								.filter(path => path.shouldBeDisplayed !== false)
								.sort((p1, p2) => p1.order - p2.order)
								.map(path => {
									return (
										<li className={getClasses(path)} key={path.path}>
											<Link to={path.path} {...path.attrs}>
												{path.label}
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
};
