import React from 'react';
import D from '../build-dictionary';
import { Link } from 'react-router-dom';

import './menu.scss';

const WITH_SEPARATOR_CLASS = 'with-separator';

function getClasses(path, index, paths) {
	if (path.alignToRight) {
		return [
			path.className,
			'navbar-right',
			!paths[index - 1] || !paths[index - 1].alignToRight
				? ''
				: WITH_SEPARATOR_CLASS,
		];
	}
	return [
		path.className,
		'navbar-left',
		!paths[index + 1] || paths[index + 1].alignToRight
			? ''
			: WITH_SEPARATOR_CLASS,
	];
}
export default ({ paths }) => {
	const orderedPaths = paths
		.filter(path => path.shouldBeDisplayed !== false)
		.sort((p1, p2) => p1.order - p2.order);
	return (
		<header>
			<nav className="navbar navbar-primary">
				<div className="container-fluid">
					<div className="collapse navbar-collapse">
						<ul className="nav navbar-nav">
							<li className="navbar-left with-separator">
								<Link to="/">{D.home}</Link>
							</li>
							{orderedPaths.map((path, index) => {
								const classes = getClasses(path, index, orderedPaths)
									.join(' ')
									.trim();
								return (
									<li className={classes} key={path.path}>
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
