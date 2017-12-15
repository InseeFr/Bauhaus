import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import MenuReferentiels from './menu-referentiels';
import { dictionary } from 'js/utils/dictionary';
import './concepts.css';

class MenuConcepts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menuRef: false,
			activePath: props.location.pathname,
		};
		this.onChangeMenu = () => {
			this.setState({
				menuRef: !this.state.menuRef,
			});
		};
		this.changeActivePath = activePath => {
			this.setState({
				activePath,
				menuRef: false,
			});
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps) {
			this.changeActivePath(nextProps.location.pathname);
		}
	}

	render() {
		const { menuRef, activePath } = this.state;
		var paths = {
			concepts: { path: '/concepts', rootPath: '/concept' },
			collections: { path: '/collections', rootPath: '/collection' },
			help: { path: '/help', rootPath: '/help' },
			administration: { path: '/administration', rootPath: '/administration' },
		};

		paths = Object.keys(paths).reduce((_, p) => {
			var className = activePath.includes(paths[p].rootPath) ? 'active' : null;
			_[p] = { ...paths[p], className };
			return _;
		}, {});

		if (activePath === '/') return null;

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
												{' '}
												{dictionary.navbar.concepts.home}
											</div>
										</a>
									</li>
									<li className={paths.concepts.className}>
										<Link
											to={paths.concepts.path}
											onClick={() => this.changeActivePath(paths.concepts.path)}
										>
											{dictionary.navbar.concepts.concepts}
										</Link>
									</li>
									<li className={paths.collections.className}>
										<Link
											to={paths.collections.path}
											onClick={() =>
												this.changeActivePath(paths.collections.path)
											}
										>
											{dictionary.navbar.concepts.collections}
										</Link>
									</li>
								</ul>
								<ul className="nav navbar-nav navbar-nav-concepts navbar-right">
									<li className={paths.help.className}>
										<Link
											to={paths.help.path}
											onClick={() => this.changeActivePath(paths.help.path)}
										>
											{dictionary.navbar.concepts.help}
										</Link>
									</li>
									<li className={paths.administration.className}>
										<Link
											to={paths.administration.path}
											onClick={() =>
												this.changeActivePath(paths.administration.path)
											}
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

export default withRouter(MenuConcepts);
