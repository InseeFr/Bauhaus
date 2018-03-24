import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import MenuReferentiels from './menu-referentiels';
import D from 'js/i18n';
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
			famillies: {
				path: '/famillies',
				pathKey: 'famil',
				className: null,
			},
			series: { path: '/series', pathKey: 'series', className: null },
			operations: {
				path: '/operations',
				pathKey: 'operation',
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
											<div className="inline"> {D.repositoryNavigation}</div>
										</a>
									</li>
									<li className={paths.famillies.className}>
										<Link
											to={paths.famillies.path}
											onClick={() =>
												this.changeActivePath(paths.famillies.path)
											}
										>
											{D.familliesTitle}
										</Link>
									</li>
									<li className={paths.series.className}>
										<Link
											to={paths.series.path}
											onClick={() => this.changeActivePath(paths.series.path)}
										>
											{D.seriesTitle}
										</Link>
									</li>
									<li className={paths.operations.className}>
										<Link
											to={paths.operations.path}
											onClick={() =>
												this.changeActivePath(paths.operations.path)
											}
										>
											{D.operationsTitle}
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
