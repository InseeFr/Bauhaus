import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import MenuReferentiels from '../referentiels';
import D from 'js/i18n';
import './classifications.scss';

class MenuClassifications extends Component {
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
			families: {
				path: '/classifications/families',
				pathKey: 'classifications/famil',
				className: null,
			},
			series: {
				path: '/classifications/series',
				pathKey: 'classifications/series',
				className: null,
			},
			correspondences: {
				path: '/classifications/correspondences',
				pathKey: 'classifications/correspondence',
				className: null,
			},
			classifications: {
				path: '/classifications',
				pathKey: 'classification',
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
					<nav className="navbar navbar-default-classifications">
						<div className="container-fluid">
							<div className="collapse navbar-collapse">
								<ul className="nav navbar-nav navbar-nav-classifications">
									<li onClick={this.onChangeMenu}>
										<a>
											<div className="glyphicon glyphicon-th navbar-icon inline" />
											<div className="inline"> {D.repositoryNavigation}</div>
										</a>
									</li>
									<li className={paths.families.className}>
										<Link
											to={paths.families.path}
											onClick={() => this.changeActivePath(paths.families.path)}
										>
											{D.familiesTitle}
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
									<li className={paths.classifications.className}>
										<Link
											to={paths.classifications.path}
											onClick={() =>
												this.changeActivePath(paths.classifications.path)
											}
										>
											{D.classificationsTitle}
										</Link>
									</li>
									<li className={paths.correspondences.className}>
										<Link
											to={paths.correspondences.path}
											onClick={() =>
												this.changeActivePath(paths.correspondences.path)
											}
										>
											{D.correspondencesTitle}
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

export default withRouter(MenuClassifications);
