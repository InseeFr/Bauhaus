import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MenuReferentiels from './menu-referentiels';
import { dictionary } from 'js/utils/dictionary';
import './menu-concepts.css';

class MenuConcepts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menuRef: false,
			activeItem: 'concepts',
		};
		this.onChangeMenu = () => {
			this.setState({
				menuRef: !this.state.menuRef,
			});
		};
		this.changeActiveItem = activeItem => {
			this.setState({
				activeItem,
			});
		};
	}

	render() {
		const { menuRef, activeItem } = this.state;

		const clsConcepts = activeItem === 'concepts' ? 'active' : null;
		const clsCollections = activeItem === 'collections' ? 'active' : null;
		const clsHelp = activeItem === 'help' ? 'active' : null;
		const clsAdministration = activeItem === 'administration' ? 'active' : null;

		console.log(activeItem);
		return (
			<div>
				<header>
					<nav className="navbar navbar-default-concepts">
						<div className="container-fluid">
							<div className="collapse navbar-collapse">
								<ul className="nav navbar-nav navbar-nav-concepts">
									<li onClick={this.onChangeMenu}>
										<a>
											<div className="glyphicon glyphicon-th navbar-icon inline" />
											<div className="inline">
												{' '}{dictionary.navbar.concepts.home}
											</div>
										</a>
									</li>
									<li className={clsConcepts}>
										<Link
											to="/concepts"
											onClick={() => this.changeActiveItem('concepts')}
										>
											{dictionary.navbar.concepts.concepts}
										</Link>
									</li>
									<li className={clsCollections}>
										<Link
											to="/collections"
											onClick={() => this.changeActiveItem('collections')}
										>
											{dictionary.navbar.concepts.collections}
										</Link>
									</li>
								</ul>
								<ul className="nav navbar-nav navbar-nav-concepts navbar-right">
									<li className={clsHelp}>
										<Link
											to="/help"
											onClick={() => this.changeActiveItem('help')}
										>
											{dictionary.navbar.concepts.help}
										</Link>
									</li>
									<li className={clsAdministration}>
										<Link
											to="/administration"
											onClick={() => this.changeActiveItem('administration')}
										>
											{dictionary.navbar.concepts.administration}
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
	}
}

export default MenuConcepts;
