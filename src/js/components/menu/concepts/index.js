import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import MenuReferentiels from '../referentiels';
import check from 'js/utils/auth/utils';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';
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
		const { permission: { authType, role } } = this.props;
		const { menuRef, activePath } = this.state;

		// TODO Fix with accuracy role adaptation
		const authImpl = check(authType);
		const adminOrContributor = authImpl.isAdminOrContributor(role);

		var paths = {
			administration: {
				path: '/concepts/administration',
				pathKey: 'administration',
				className: null,
			},
			help: { path: '/concepts/help', pathKey: 'help', className: null },
			concepts: { path: '/concepts', pathKey: 'concept', className: null },
			collections: {
				path: '/collections',
				pathKey: 'collection',
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
					<nav className="navbar navbar-default-concepts">
						<div className="container-fluid">
							<div className="collapse navbar-collapse">
								<ul className="nav navbar-nav navbar-nav-concepts">
									<li onClick={this.onChangeMenu}>
										<a>
											<div className="glyphicon glyphicon-th navbar-icon inline" />
											<div className="inline"> {D.repositoryNavigation}</div>
										</a>
									</li>
									<li className={paths.concepts.className}>
										<Link
											to={paths.concepts.path}
											onClick={() => this.changeActivePath(paths.concepts.path)}
										>
											{D.conceptsTitle}
										</Link>
									</li>
									<li className={paths.collections.className}>
										<Link
											to={paths.collections.path}
											onClick={() =>
												this.changeActivePath(paths.collections.path)
											}
										>
											{D.collectionsTitle}
										</Link>
									</li>
								</ul>
								{adminOrContributor && (
									<ul className="nav navbar-nav navbar-nav-concepts navbar-right">
										<li className={paths.help.className}>
											<Link
												to={paths.help.path}
												onClick={() => this.changeActivePath(paths.help.path)}
											>
												{D.help}
											</Link>
										</li>
										<li className={paths.administration.className}>
											<Link
												to={paths.administration.path}
												onClick={() =>
													this.changeActivePath(paths.administration.path)
												}
											>
												{D.administrationTitle}
											</Link>
										</li>
									</ul>
								)}
							</div>
						</div>
					</nav>
				</header>
				{menuRef && <MenuReferentiels />}
			</div>
		);
	}
}

MenuConcepts.propTypes = {
	permission: permissionOverviewPropTypes.isRequired,
};

export default withRouter(MenuConcepts);
