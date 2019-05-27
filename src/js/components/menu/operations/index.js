import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import MenuReferentiels from '../referentiels';
import { connect } from 'react-redux';

import D from 'js/i18n';
import './operations.scss';
import { compose } from 'recompose';
import { getOperationsSimsCurrent } from 'js/reducers';

const ACTIVE = 'active';

class MenuOperations extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menuRef: false,
			paths: {
				families: {
					path: '/operations/families',
					pathKey: 'operations/famil',
					className: null,
				},
				series: {
					path: '/operations/series',
					pathKey: 'operations/series',
					className: null,
				},
				indicators: {
					path: '/operations/indicators',
					pathKey: 'operations/indicator',
					className: null,
				},
				help: {
					path: '/operations/help',
					pathKey: 'help',
					className: null,
				},
				operations: {
					path: '/operations',
					pathKey: 'operation',
					className: 'active',
				},
			},
		};
	}

	onChangeMenu = () => {
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

			const paths = Object.keys(this.state.paths).reduce((acc, key) => {
				return {
					...acc,
					[key]: {
						...this.state.paths[key],
						className: '',
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
					this.props.location.pathname.includes(paths.series.pathKey)
				) {
					paths['series']['className'] = ACTIVE;
				} else if (
					nextProps.sims.idIndicator ||
					this.props.location.pathname.includes(paths.indicators.pathKey)
				) {
					paths['indicators']['className'] = ACTIVE;
				} else if (
					nextProps.sims.idOperation ||
					this.props.location.pathname.includes(paths.operations.pathKey)
				) {
					paths['operations']['className'] = ACTIVE;
				}
			} else {
				for (let key in paths) {
					if (nextProps.location.pathname.includes(paths[key]['pathKey'])) {
						paths[key]['className'] = ACTIVE;
						break;
					}
				}
			}
			this.setState({ paths });
		}
	}

	render() {
		const { menuRef, activePath, paths } = this.state;

		if (activePath === '/') return null;

		return (
			<React.Fragment>
				<header>
					<nav className="navbar navbar-default-operations">
						<div className="container-fluid">
							<div className="collapse navbar-collapse">
								<ul className="nav navbar-nav navbar-nav-operations">
									<li>
										<button onClick={this.onChangeMenu}>
											<span className="glyphicon glyphicon-th navbar-icon inline" />
											<span className="inline"> {D.repositoryNavigation}</span>
										</button>
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
									<li className={paths.indicators.className}>
										<Link
											to={paths.indicators.path}
											onClick={() =>
												this.changeActivePath(paths.indicators.path)
											}
										>
											{D.indicatorsTitle}
										</Link>
									</li>
									<li className={paths.help.className + ' navbar-right'}>
										<Link
											to={paths.help.path}
											onClick={() => this.changeActivePath(paths.help.path)}
										>
											{D.help}
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</nav>
				</header>
				{menuRef && <MenuReferentiels />}
			</React.Fragment>
		);
	}
}

export default compose(
	withRouter,
	connect(state => {
		return { sims: getOperationsSimsCurrent(state) };
	})
)(MenuOperations);
