import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loading-overlay';
import * as select from 'js/reducers';
import Home from './home';
import { dictionary } from 'js/utils/dictionary';
import { ADD_ROLE, DELETE_ROLE } from 'js/actions/constants';
import loadRoleList from 'js/actions/roles/role';
import loadAgentList from 'js/actions/roles/agent';
import addRole from 'js/actions/roles/add';
import deleteRole from 'js/actions/roles/delete';
import { OK } from 'js/constants';

class RolesContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			deleteRequested: false,
			addRequested: false,
			edition: false,
		};

		this.setEdition = edition => {
			this.setState({
				edition,
			});
		};
		this.addAgent = data => {
			this.setState({
				addRequested: true,
				edition: false,
			});
			this.props.addRole(data);
		};
		this.deleteAgent = data => {
			this.setState({
				deleteRequested: true,
			});
			this.props.deleteRole(data);
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

	componentWillReceiveProps({ addStatus, deleteStatus }) {
		const { addRequested, deleteRequested } = this.state;
		if (deleteRequested || addRequested) {
			if (deleteStatus === OK)
				this.setState({
					deleteRequested: false,
				});
			if (addStatus === OK)
				this.setState({
					addRequested: false,
				});
			this.props.loadRoleList();
		}
	}

	render() {
		const { edition, addRequested, deleteRequested } = this.state;

		const { roles, agents, addStatus, deleteStatus } = this.props;

		if (
			(deleteRequested && deleteStatus !== OK) ||
			(addRequested && addStatus !== OK)
		) {
			return (
				<Loadable
					active={true}
					spinner
					text={dictionary.loadable.saving}
					color="#457DBB"
					background="grey"
					spinnerSize="400px"
				/>
			);
		}

		if (roles && agents) {
			return (
				<Home
					roles={roles}
					agents={agents}
					addAgent={this.addAgent}
					deleteAgent={this.deleteAgent}
					edition={edition}
					setEdition={this.setEdition}
				/>
			);
		}

		return (
			<div>
				<Loadable
					active={true}
					spinner
					text={dictionary.loadable.loading}
					color="#457DBB"
					background="grey"
					spinnerSize="400px"
				/>
			</div>
		);
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

export default connect(mapStateToProps, mapDispatchToProps)(RolesContainer);
