import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import MenuReferentiels from 'js/components/menu/referentiels';
import check from 'js/utils/auth';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';
import './concepts.scss';
import { compose } from 'recompose';
import { withPermissions } from 'js/components/menu/home-container';

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
		const {
			permission: { authType, roles },
		} = this.props;
		const { menuRef, activePath } = this.state;

		const authImpl = check(authType);
		const adminOrContributor = authImpl.isAdminOrContributor(roles);

		var paths = {
			administration: {
				path: '/concepts/administration',
				pathKey: 'administration',
				className: null,
			},
			help: { path: '/concepts/help/1', pathKey: 'help', className: null },
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
									<li>
										<button onClick={this.onChangeMenu}>
											<span className="glyphicon glyphicon-th navbar-icon inline" />
											<span className="inline"> {D.repositoryNavigation}</span>
										</button>
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
									<li className={paths.help.className + ' navbar-right'}>
										<Link
											to={paths.help.path}
											onClick={() => this.changeActivePath(paths.help.path)}
											target="_blank"
										>
											{D.help}
										</Link>
									</li>
									{adminOrContributor && (
										<li className={paths.help.className + ' navbar-right'}>
											<Link
												to={paths.administration.path}
												onClick={() =>
													this.changeActivePath(paths.administration.path)
												}
											>
												{D.administrationTitle}
											</Link>
										</li>
									)}
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

MenuConcepts.propTypes = {
	permission: permissionOverviewPropTypes.isRequired,
};

export default compose(
	withRouter,
	withPermissions
)(MenuConcepts);
