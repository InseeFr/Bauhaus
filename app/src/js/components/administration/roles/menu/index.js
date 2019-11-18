import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import MenuReferentiels from 'js/components/menu/referentiels';

import D from 'js/i18n';
import { compose } from 'recompose';
class Menu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menuRef: false,
		};
	}

	onChangeMenu = e => {
		e.preventDefault();
		this.setState({
			menuRef: !this.state.menuRef,
		});
	};

	render() {
		const { menuRef } = this.state;

		return (
			<>
				<header>
					<nav className="navbar navbar-primary">
						<div className="container-fluid">
							<div className="collapse navbar-collapse">
								<ul className="nav navbar-nav">
									<li>
										<Link to="/" onClick={this.onChangeMenu}>
											{D.repositoryNavigation}
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</nav>
				</header>
				{menuRef && <MenuReferentiels />}
			</>
		);
	}
}

export default compose(withRouter)(Menu);
