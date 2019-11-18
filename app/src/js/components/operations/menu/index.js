import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import D from 'js/i18n';
import { compose } from 'recompose';
import { getOperationsSimsCurrent } from 'js/reducers';

const ACTIVE = 'active';
const defaultAttrs = { 'aria-current': 'page' };
class MenuOperations extends Component {
	constructor(props) {
		super(props);
		this.state = {
			paths: this.setActiveItem(this.props, {
				families: {
					path: '/operations/families',
					pathKey: /operations\/famil/,
					className: null,
					attrs: null,
				},
				series: {
					path: '/operations/series',
					pathKey: /operations\/series/,
					className: null,
					attrs: null,
				},
				indicators: {
					path: '/operations/indicators',
					pathKey: /operations\/indicator/,
					className: null,
					attrs: null,
				},
				help: {
					path: '/operations/help',
					pathKey: /help/,
					className: null,
					attrs: null,
				},
				document: {
					path: '/operations/documents',
					pathKey: /(link|document)/,
					className: null,
					attrs: null,
				},
				operations: {
					path: '/operations',
					pathKey: /operation/,
					className: 'active',
					attrs: defaultAttrs,
				},
			}),
		};
	}

	changeActivePath = activePath => {
		this.setState({
			activePath,
		});
	};

	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps) {
			this.changeActivePath(nextProps.location.pathname);

			const paths = this.setActiveItem(nextProps, this.state.paths);
			this.setState({ paths });
		}
	}

	setActiveItem(nextProps, currentPaths) {
		const paths = Object.keys(currentPaths).reduce((acc, key) => {
			return {
				...acc,
				[key]: {
					...currentPaths[key],
					className: '',
					attrs: {},
				},
			};
		}, {});

		/**
		 * If we are on the SIMS page, we have to check on which parent element we are working on.
		 * Two possibilities, during the update phase, we check the presence of the idOperation, idSeries or idIndicator properties of the current SIMS
		 * During the creation phase, we are checking the previous page.
		 */
		if (nextProps.location.pathname.includes('sims')) {
			if (
				nextProps.sims.idSeries ||
				paths.series.pathKey.test(this.props.location.pathname)
			) {
				paths['series']['className'] = ACTIVE;
				paths['series']['attrs'] = defaultAttrs;
			} else if (
				nextProps.sims.idIndicator ||
				paths.indicators.pathKey.test(this.props.location.pathname)
			) {
				paths['indicators']['className'] = ACTIVE;
				paths['indicators']['attrs'] = defaultAttrs;
			} else if (
				nextProps.sims.idOperation ||
				paths.operations.pathKey.test(this.props.location.pathname)
			) {
				paths['operations']['className'] = ACTIVE;
				paths['operations']['attrs'] = defaultAttrs;
			}
		} else {
			for (let key in paths) {
				if (paths[key]['pathKey'].test(nextProps.location.pathname)) {
					paths[key]['className'] = ACTIVE;
					paths[key]['attrs'] = defaultAttrs;

					break;
				}
			}
		}
		return paths;
	}
	render() {
		const { activePath, paths } = this.state;

		if (activePath === '/') return null;

		return (
			<>
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
									<li className={paths.operations.className}>
										<Link
											to={paths.operations.path}
											onClick={() =>
												this.changeActivePath(paths.operations.path)
											}
											{...paths.operations.attrs}
										>
											{D.operationsTitle}
										</Link>
									</li>
									<li className={paths.indicators.className}>
										<Link
											to={paths.indicators.path}
											onClick={() =>
												this.changeActivePath(paths.indicators.path)
											}
											{...paths.indicators.attrs}
										>
											{D.indicatorsTitle}
										</Link>
									</li>

									<li className={paths.help.className + ' navbar-right'}>
										<Link
											to={paths.help.path}
											onClick={() => this.changeActivePath(paths.help.path)}
											{...paths.help.attrs}
										>
											{D.help}
										</Link>
									</li>

									<li className={paths.document.className + ' navbar-right'}>
										<Link
											to={paths.document.path}
											onClick={() => this.changeActivePath(paths.document.path)}
											{...paths.help.attrs}
										>
											{D.titleDocument} / {D.titleLink}
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</nav>
				</header>
			</>
		);
	}
}

export default compose(
	withRouter,
	connect(state => {
		return { sims: getOperationsSimsCurrent(state) };
	})
)(MenuOperations);
