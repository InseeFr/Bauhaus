import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import MenuReferentiels from 'js/components/menu/referentiels';

import D from 'js/i18n';
import { compose } from 'recompose';
import 'js/components/concepts/menu/concepts.scss';
class Menu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menuRef: false,
		};
	}

	onChangeMenu = () => {
		this.setState({
			menuRef: !this.state.menuRef,
		});
	};

	changeActivePath = activePath => {
		this.setState({
			menuRef: false,
		});
	};

	render() {
		const { menuRef } = this.state;

		return (
			<>
				<header>
					<nav className="navbar navbar-default-concepts">
						<div className="container-fluid">
							<div className="collapse navbar-collapse">
								<ul className="nav navbar-nav navbar-nav-concepts">
									<li>
										<button onClick={this.onChangeMenu}>
											<span className="glyphicon glyphicon-th navbar-icon inline" />
											<span className="inline"> {D.repositoryNavigation}</span>
										</button>
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
