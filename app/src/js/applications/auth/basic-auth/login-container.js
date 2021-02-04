import React, { Component } from 'react';
import { connect } from 'react-redux';
import Auth from 'js/applications/auth/basic-auth/login';
import { Loading } from '@inseefr/wilco';
import { checkAuth } from 'js/actions/app';
import loadStampList from 'js/actions/stamp';
import { Stores } from 'bauhaus-utilities';
import api from 'js/remote-api/api';

class LoginBasicContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			updateRequested: false,
		};
		this.onClickValidate = (data) => {
			api.postFakeUser( {
				stamp: data.stamp,
				roles: data.role.map(r => r.value)
			}).finally(() => {
				const { stamp, role } = data;
				this.props.checkAuth({ stamp, roles: role.map((r) => r.value) });
				this.setState({
					updateRequested: true,
				});
			})

		};
	}

	componentWillMount() {
		const { stampList } = this.props;
		const { roleList } = this.state;
		if (!roleList) {
			api.getRoleList().then((roleList) => {
				this.setState({
					roleList,
				});
			});
		}
		if (stampList.length === 0) this.props.loadStampList();
	}

	render() {
		const { stampList } = this.props;
		const { updateRequested, roleList } = this.state;

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

const mapStateToProps = (state) => {
	return {
		stampList: Stores.Stamps.getStampList(state),
	};
};

const mapDispatchToProps = {
	loadStampList,
	checkAuth,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginBasicContainer);
