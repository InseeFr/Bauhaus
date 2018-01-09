import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import MenuReferentiels from './menu-referentiels';
import { dictionary } from 'js/utils/dictionary';
import './operations.css';

class MenuOperations extends Component {
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
			subGroups: {
				path: '/sub-groups',
				pathKey: 'sub-group',
				className: null,
			},
			groups: { path: '/groups', pathKey: 'group', className: null },
			studyUnits: {
				path: '/study-units',
				pathKey: 'study-unit',
				className: null,
			},
		};

		for (var key in paths) {
			if (this.props.location.pathname.includes(paths[key]['pathKey'])) {
				paths[key]['className'] = 'active';
				break;
			}
		}

		if (activePath === '/') return null;

		return (
			<div>
				<header>
					<nav className="navbar navbar-default-operations">
						<div className="container-fluid">
							<div className="collapse navbar-collapse">
								<ul className="nav navbar-nav navbar-nav-operations">
									<li onClick={this.onChangeMenu}>
										<a>
											<div className="glyphicon glyphicon-th navbar-icon inline" />
											<div className="inline">
												{' '}
												{dictionary.navbar.operations.home}
											</div>
										</a>
									</li>
									<li className={paths.groups.className}>
										<Link
											to={paths.groups.path}
											onClick={() => this.changeActivePath(paths.groups.path)}
										>
											{dictionary.navbar.operations.groups}
										</Link>
									</li>
									<li className={paths.subGroups.className}>
										<Link
											to={paths.subGroups.path}
											onClick={() =>
												this.changeActivePath(paths.subGroups.path)
											}
										>
											{dictionary.navbar.operations.subGroups}
										</Link>
									</li>
									<li className={paths.studyUnits.className}>
										<Link
											to={paths.studyUnits.path}
											onClick={() =>
												this.changeActivePath(paths.studyUnits.path)
											}
										>
											{dictionary.navbar.operations.studyUnits}
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

export default withRouter(MenuOperations);
