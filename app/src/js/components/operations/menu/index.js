import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import MenuReferentiels from 'js/components/menu/referentiels';
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
			menuRef: false,
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

	onChangeMenu = e => {
		e.preventDefault();

		this.setState({
			menuRef: !this.state.menuRef,
		});
	};

	changeActivePath = activePath => {
		this.setState({
			activePath,
			menuRef: false,
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
		const { menuRef, activePath, paths } = this.state;

		if (activePath === '/') return null;

		return (
			<>
				<header>
					<nav className="navbar navbar-primary">
						<div className="container-fluid">
							<div className="collapse navbar-collapse">
								<ul className="nav navbar-nav">
									<li>
										<Link to="/" onClick={this.onChangeMenu}>
											{D.repositoryNavigation}
										</Link>
									</li>
									<li
										className={paths.families.className}
										{...paths.families.attrs}
									>
										<Link
											aria-current="page"
											to={paths.families.path}
											onClick={() => this.changeActivePath(paths.families.path)}
										>
											{D.familiesTitle}
										</Link>
									</li>
									<li
										className={paths.series.className}
										{...paths.series.attrs}
									>
										<Link
											to={paths.series.path}
											onClick={() => this.changeActivePath(paths.series.path)}
										>
											{D.seriesTitle}
										</Link>
									</li>
									<li
										className={paths.operations.className}
										{...paths.operations.attrs}
									>
										<Link
											to={paths.operations.path}
											onClick={() =>
												this.changeActivePath(paths.operations.path)
											}
										>
											{D.operationsTitle}
										</Link>
									</li>
									<li
										className={paths.indicators.className}
										{...paths.indicators.attrs}
									>
										<Link
											to={paths.indicators.path}
											onClick={() =>
												this.changeActivePath(paths.indicators.path)
											}
										>
											{D.indicatorsTitle}
										</Link>
									</li>

									<li
										className={paths.help.className + ' navbar-right'}
										{...paths.help.attrs}
									>
										<Link
											to={paths.help.path}
											onClick={() => this.changeActivePath(paths.help.path)}
										>
											{D.help}
										</Link>
									</li>

									<li
										className={paths.document.className + ' navbar-right'}
										{...paths.help.attrs}
									>
										<Link
											to={paths.document.path}
											onClick={() => this.changeActivePath(paths.document.path)}
										>
											{D.titleDocument} / {D.titleLink}
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</nav>
				</header>
				{menuRef && <MenuReferentiels />}
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
