import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import D from 'js/i18n';
import { compose } from 'recompose';

const Menu = () => {
	return (
		<>
			<header>
				<nav className="navbar navbar-primary">
					<div className="container-fluid">
						<div className="collapse navbar-collapse">
							<ul className="nav navbar-nav">
								<li>
									<Link to="/">{D.home}</Link>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</header>
		</>
	);
};

export default compose(withRouter)(Menu);
