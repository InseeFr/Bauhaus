import React, { Fragment, Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Loading } from '@inseefr/wilco';
import Menu from './menu';
import Visualisation from './visualisation';
import Update from './update';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const initState = {
	deleteRequested: false,
	addRequested: false,
	needRefresh: false,
};

class Habilitation extends Component {
	state = { ...initState };
	addAgent = data => {
		console.log('addAgent');

		this.setState(() => ({
			addRequested: true,
		}));
		this.props.addAgent(data).then(this.needRefresh, this.needRefresh);
	};

	needRefresh = () => {
		this.setState(() => ({
			...initState,
			needRefresh: true,
		}));
	};
	deleteAgent = data => {
		console.log('deleteAgent');

		this.setState(() => ({
			deleteRequested: true,
		}));
		this.props.deleteAgent(data).then(this.needRefresh, this.needRefresh);
	};

	handleSave = data => {
		const { toAdd, toDelete } = data;
		if (toAdd.length !== 0) this.addAgent(toAdd);
		if (toDelete.length !== 0) this.deleteAgent(toDelete);
	};

	loadAgentList = () => {
		console.log('loadAgentList');

		this.props.loadAgentList().then(agents =>
			this.setState(() => ({
				agents,
			}))
		);
	};

	loadRoleList = () => {
		console.log('loadRoleList');
		this.props.loadRoleList().then(roles =>
			this.setState(() => ({
				roles,
			}))
		);
	};
	componentWillMount() {
		if (!this.state.roles) {
			this.loadRoleList();
		}
		if (!this.state.agents) {
			this.loadAgentList();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.location.pathname !== nextProps.location.pathname) {
			this.setState({ ...initState });
			this.loadRoleList();
		}
	}

	componentDidMount() {
		document.getElementById('root-app').classList = ['bauhaus-app'];
	}
	render() {
		const {
			addRequested,
			deleteRequested,
			roles,
			agents,
			needRefresh,
		} = this.state;

		if (deleteRequested || addRequested) return <Loading textType="saving" />;

		if (needRefresh) return <Redirect to="/habilitation" />;
		if (roles && agents) {
			return (
				<Fragment>
					<Menu></Menu>
					<Switch>
						<Route path={this.props.match.path + '/update'}>
							<Update
								roles={roles}
								agents={agents}
								handleSave={this.handleSave}
							/>
						</Route>
						<Route path="">
							<Visualisation roles={roles} />
						</Route>
					</Switch>
				</Fragment>
			);
		}
		return <Loading />;
	}
}

Habilitation.propTypes = {
	loadAgentList: PropTypes.func.isRequired,
	loadRoleList: PropTypes.func.isRequired,
	deleteAgent: PropTypes.func.isRequired,
	addAgent: PropTypes.func.isRequired,
};

Habilitation.defaultProps = {
	loadAgentList: () => Promise.resolve(),
	loadRoleList: () => Promise.resolve(),
	deleteAgent: () => Promise.resolve(),
	addAgent: () => Promise.resolve(),
};
export default withRouter(Habilitation);
