import React, { Component } from 'react';
import D from 'js/i18n';
import { Menu } from '@inseefr/wilco';
import { withRouter } from 'react-router-dom';

const ACTIVE = 'active';
const defaultAttrs = { 'aria-current': 'page' };

class MenuDSDs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			paths: this.setActiveItem(this.props, {
				components: {
					path: '/structures/components',
					pathKey: /structures\/component/,
					className: null,
					attrs: null,
					order: 2,
					label: D.componentTitle,
				},
				structures: {
					path: '/structures',
					pathKey: /structures/,
					className: null,
					attrs: null,
					order: 1,
					label: D.structuresTitle,
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
		for (let key in paths) {
			if (paths[key]['pathKey'].test(nextProps.location.pathname)) {
				paths[key]['className'] = ACTIVE;
				paths[key]['attrs'] = defaultAttrs;

				break;
			}
		}

		return paths;
	}
	render() {
		const { activePath, paths } = this.state;

		if (activePath === '/') return null;

		return <Menu paths={Object.values(paths)} />;
	}
}

export default withRouter(MenuDSDs);
