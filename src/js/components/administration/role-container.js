import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loading-overlay';
import * as select from 'js/reducers';
import Role from './role';
import { dictionary } from 'js/utils/dictionary';
import loadRoleList from 'js/actions/role';
import loadAgentList from 'js/actions/agent';

class RolesContainer extends Component {
	componentWillMount() {
		if (!this.props.roleList) {
			this.props.loadRoleList();
		}
		if (!this.props.agentList) {
			this.props.loadAgentList();
		}
	}

	render() {
		const { roles, agents } = this.props;

		if (!roles || !agents) {
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
		return <Role roles={roles} agents={agents} />;
	}
}

const mapStateToProps = state => {
	return {
		roles: select.getRoleList(state),
		agents: select.getAgentList(state),
	};
};

const mapDispatchToProps = {
	loadRoleList,
	loadAgentList,
};

export default connect(mapStateToProps, mapDispatchToProps)(RolesContainer);
