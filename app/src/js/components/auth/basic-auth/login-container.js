import React, { Component } from 'react';
import { connect } from 'react-redux';
import Auth from 'js/components/auth/basic-auth/login';
import { Loading } from 'bauhaus-library';
import { checkAuth } from 'js/actions/app';
import loadRoleList from 'js/actions/roles/role';
import loadStampList from 'js/actions/stamp';
import * as select from 'js/reducers';

class LoginBasicContainer extends Component {
	constructor(props) {
		super();
		this.state = {
			updateRequested: false,
		};
		this.onClickValidate = data => {
			const { stamp, role } = data;
			this.props.checkAuth({ stamp, roles: role.map(r => r.value) });
			this.setState({
				updateRequested: true,
			});
		};
	}

	componentWillMount() {
		const { roleList, stampList } = this.props;
		if (!roleList) {
			this.props.loadRoleList();
		}
		if (!stampList) this.props.loadStampList();
	}

	render() {
		const { roleList, stampList } = this.props;
		const { updateRequested } = this.state;

		if (updateRequested) return <Loading textType="authentification" />;
		if (roleList && stampList) {
			const roleListBasic = [
				...roleList,
				{ persons: [], id: 'GUEST', label: 'Guest' },
			];
			return (
				<Auth
					roleList={roleListBasic}
					stampList={stampList}
					checkAuth={this.onClickValidate}
				/>
			);
		}
		return <Loading />;
	}
}

const mapStateToProps = state => {
	return {
		roleList: select.getRoleList(state),
		stampList: select.getStampList(state),
	};
};

const mapDispatchToProps = {
	loadRoleList,
	loadStampList,
	checkAuth,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginBasicContainer);
