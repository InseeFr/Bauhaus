import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Loading } from 'bauhaus-library';
import * as select from 'js/reducers';
import Visualisation from './visualisation';
import Update from './update';
import { ADD_ROLE, DELETE_ROLE } from 'js/actions/constants';
import loadRoleList from 'js/actions/roles/role';
import loadAgentList from 'js/actions/roles/agent';
import addRole from 'js/actions/roles/add';
import deleteRole from 'js/actions/roles/delete';
import { OK } from 'js/constants';
import Menu from 'js/applications/administration/roles/menu';

const initState = {
	deleteRequested: false,
	addRequested: false,
};

class RolesContainer extends Component {
	constructor(props) {
		super(props);
		this.state = { ...initState };

		this.addAgent = data => {
			this.setState({
				addRequested: true,
			});
			this.props.addRole(data);
		};
		this.deleteAgent = data => {
			this.setState({
				deleteRequested: true,
			});
			this.props.deleteRole(data);
		};
		this.handleSave = data => {
			const { toAdd, toDelete } = data;
			if (toAdd.length !== 0) this.addAgent(toAdd);
			if (toDelete.length !== 0) this.deleteAgent(toDelete);
		};
	}

	componentWillMount() {
		if (!this.props.roles) {
			this.props.loadRoleList();
		}
		if (!this.props.agents) {
			this.props.loadAgentList();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.location.pathname !== nextProps.location.pathname) {
			this.setState({ ...initState });
			this.props.loadRoleList();
		}
	}

	componentDidMount() {
		document.getElementById('root-app').classList = ['bauhaus-app'];
	}
	render() {
		const { addRequested, deleteRequested } = this.state;

		const {
			roles,
			agents,
			addStatus,
			deleteStatus,
			location: { pathname },
		} = this.props;

		if (
			(deleteRequested && deleteStatus !== OK) ||
			(addRequested && addStatus !== OK)
		)
			return <Loading textType="saving" />;

		if (
			(!deleteRequested && addRequested && addStatus) ||
			(!addRequested && deleteRequested && deleteStatus) ||
			(deleteRequested && deleteStatus && addRequested && addStatus)
		)
			return <Redirect to="/administration/roles" />;

		if (roles && agents) {
			return (
				<>
					<Menu></Menu>
					{pathname.endsWith('update') ? (
						<Update
							roles={roles}
							agents={agents}
							handleSave={this.handleSave}
						/>
					) : (
						<Visualisation roles={roles} />
					)}
				</>
			);
		}
		return <Loading />;
	}
}

const mapStateToProps = state => {
	return {
		roles: select.getRoleList(state),
		agents: select.getAgentList(state),
		addStatus: select.getStatus(state, ADD_ROLE),
		deleteStatus: select.getStatus(state, DELETE_ROLE),
	};
};

const mapDispatchToProps = {
	loadRoleList,
	loadAgentList,
	addRole,
	deleteRole,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RolesContainer);
