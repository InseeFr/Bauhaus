import { Component } from 'react';
import { connect } from 'react-redux';

import { MainMenu } from '../../components/menu';
import D from '../../deprecated-locales';
import { getOperationsSimsCurrent } from '../../redux/selectors';

const ACTIVE = 'active';
const defaultAttrs = { 'aria-current': 'page' };
export class MenuOperations extends Component {
	constructor(props) {
		super(props);
		this.state = {
			paths: this.setActiveItem(this.props, {
				families: {
					path: '/operations/families',
					pathKey: /operations\/famil/,
					className: null,
					attrs: null,
					order: 1,
					label: D.familiesTitle,
				},
				series: {
					path: '/operations/series',
					pathKey: /operations\/series/,
					className: null,
					attrs: null,
					order: 2,
					label: D.seriesTitle,
				},
				indicators: {
					path: '/operations/indicators',
					pathKey: /operations\/indicator/,
					className: null,
					attrs: null,
					order: 4,
					label: D.indicatorsTitle,
				},
				help: {
					path: import.meta.env.VITE_OPERATIONS_DOCUMENTATION,
					attrs: {
						target: '_blank',
					},
					pathKey: /help/,
					className: null,
					alignToRight: true,
					order: 6,
					label: D.help,
				},
				document: {
					path: '/operations/documents',
					pathKey: /(link|document)/,
					className: null,
					attrs: null,
					alignToRight: true,
					order: 5,
					label: `${D.document} / ${D.titleLink}`,
				},
				operations: {
					path: '/operations/operations',
					pathKey: /operations\/operation/,
					className: 'active',
					attrs: defaultAttrs,
					order: 3,
					label: D.operationsTitle,
				},
			}),
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps) {
			this.setState({
				paths: nextProps.location.pathname,
			});

			const paths = this.setActiveItem(nextProps, this.state.paths);
			this.setState({ paths });
		}
	}

	setActiveItem(nextProps, currentPaths) {
		const paths = Object.keys(currentPaths).reduce((acc, key) => {
			let attrs = {};
			if (currentPaths[key].attrs?.target === '_blank') {
				attrs = {
					target: '_blank',
				};
			}
			return {
				...acc,
				[key]: {
					...currentPaths[key],
					className: '',
					attrs,
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

		return <MainMenu paths={Object.values(paths)} />;
	}
}

export default connect((state) => {
	return { sims: getOperationsSimsCurrent(state) };
})(MenuOperations);
