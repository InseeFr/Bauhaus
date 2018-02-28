import React, { Component } from 'react';
import { connect } from 'react-redux';
import Auth from 'js/components/auth/basic-auth/login';
import Loadable from 'react-loading-overlay';
import { checkAuth } from 'js/actions/app';
import loadRoleList from 'js/actions/roles/role';
import loadStampList from 'js/actions/stamp';
import * as select from 'js/reducers';
import { dictionary } from 'js/utils/dictionary';

class LoginBasicContainer extends Component {
	constructor(props) {
		super();
		this.state = {
			updateRequested: false,
		};
		this.onClickValidate = data => {
			this.props.checkAuth(data);
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

		if (updateRequested)
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
		if (roleList && stampList)
			return (
				<Auth
					roleList={roleList}
					stampList={stampList}
					checkAuth={this.onClickValidate}
				/>
			);

		return (
			<Loadable
				active={true}
				spinner
				text={dictionary.loadable.loading}
				color="#457DBB"
				background="grey"
				spinnerSize="400px"
			/>
		);
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

export default connect(mapStateToProps, mapDispatchToProps)(
	LoginBasicContainer
);
