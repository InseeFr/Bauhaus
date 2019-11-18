import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import check from 'js/utils/auth';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';
import { compose } from 'recompose';
import { withPermissions } from 'js/components/menu/home-container';
const defaultAttrs = { 'aria-current': 'page' };

class MenuConcepts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePath: props.location.pathname,
		};

		this.changeActivePath = activePath => {
			this.setState({
				activePath,
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
		const { activePath } = this.state;

		const authImpl = check(authType);
		const adminOrContributor = authImpl.isAdminOrContributor(roles);

		var paths = {
			administration: {
				path: '/concepts/administration',
				pathKey: 'administration',
				className: null,
				attrs: null,
			},
			help: { path: '/concepts/help/1', pathKey: 'help', className: null },
			concepts: { path: '/concepts', pathKey: 'concept', className: null },
			collections: {
				path: '/collections',
				pathKey: 'collection',
				className: null,
				attrs: null,
			},
		};

		for (var key in paths) {
			if (this.props.location.pathname.includes(paths[key]['pathKey'])) {
				paths[key]['className'] = 'active';
				paths[key]['attrs'] = defaultAttrs;
				break;
			}
		}

		if (activePath === '/') return null;

		return (
			<div>
				<header>
					<nav className="navbar navbar-primary">
						<div className="container-fluid">
							<div className="collapse navbar-collapse">
								<ul className="nav navbar-nav">
									<li>
										<Link to="/">{D.home}</Link>
									</li>
									<li className={paths.concepts.className}>
										<Link
											to={paths.concepts.path}
											onClick={() => this.changeActivePath(paths.concepts.path)}
											{...paths.concepts.attrs}
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
											{...paths.collections.attrs}
										>
											{D.collectionsTitle}
										</Link>
									</li>
									<li className={paths.help.className + ' navbar-right'}>
										<Link
											to={paths.help.path}
											onClick={() => this.changeActivePath(paths.help.path)}
											target="_blank"
											{...paths.help.attrs}
										>
											{D.help}
										</Link>
									</li>
									{adminOrContributor && (
										<li
											className={
												paths.administration.className + ' navbar-right'
											}
										>
											<Link
												to={paths.administration.path}
												onClick={() =>
													this.changeActivePath(paths.administration.path)
												}
												{...paths.administration.attrs}
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
