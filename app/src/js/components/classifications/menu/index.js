import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import D from 'js/i18n';
const defaultAttrs = { 'aria-current': 'page' };

class MenuClassifications extends Component {
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
		const { activePath } = this.state;
		var paths = {
			families: {
				path: '/classifications/families',
				pathKey: 'classifications/famil',
				className: null,
				attrs: null,
			},
			series: {
				path: '/classifications/series',
				pathKey: 'classifications/series',
				className: null,
				attrs: null,
			},
			correspondences: {
				path: '/classifications/correspondences',
				pathKey: 'classifications/correspondence',
				className: null,
				attrs: null,
			},
			classifications: {
				path: '/classifications',
				pathKey: 'classification',
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
									<li className={paths.families.className}>
										<Link
											to={paths.families.path}
											onClick={() => this.changeActivePath(paths.families.path)}
											{...paths.families.attrs}
										>
											{D.familiesTitle}
										</Link>
									</li>
									<li className={paths.series.className}>
										<Link
											to={paths.series.path}
											onClick={() => this.changeActivePath(paths.series.path)}
											{...paths.series.attrs}
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
											{...paths.classifications.attrs}
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
											{...paths.correspondences.attrs}
										>
											{D.correspondencesTitle}
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</nav>
				</header>
			</div>
		);
	}
}

export default withRouter(MenuClassifications);
