import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from '@inseefr/wilco';
import D from 'js/i18n';

class LoginBasic extends Component {
	static propTypes = {
		roleList: PropTypes.array.isRequired,
		stampList: PropTypes.array.isRequired,
		checkAuth: PropTypes.func.isRequired,
	};
	constructor() {
		super();
		this.state = { role: '', stamp: '' };
	}

	handleChangeRole = (role) => this.setState({ role });
	handleChangeStamp = (stamp) => this.setState({ stamp });
	onClickValidate = () => {
		const { role, stamp } = this.state;
		this.props.checkAuth({ role, stamp });
	};

	componentDidMount() {
		document.getElementById('root-app').classList = ['concepts'];
	}
	render() {
		const { roleList, stampList } = this.props;
		const { role, stamp } = this.state;

		const roleOptions = roleList.map(({ label, id }) => ({
			label: label,
			value: id,
		}));
		const stampOptions = stampList.map((s) => ({
			label: s,
			value: s,
		}));

		return (
			<div>
				<div className="text-center page-title">
					<h1>{D.welcome}</h1>
				</div>
				<div className="container" style={{ marginTop: '10%' }}>
					<div className="row text-center">
						<h3>{D.pickedUserProfil}</h3>
					</div>
					<div className="row" style={{ marginTop: '2%' }}>
						<div className="col-md-6 col-md-offset-3">
							<Select
								value={role}
								multi={true}
								placeholder={D.pickedRolePlaceholder}
								options={roleOptions}
								onChange={this.handleChangeRole}
								searchable
							/>
						</div>
					</div>
					<div className="row" style={{ marginTop: '2%' }}>
						<div className="col-md-6 col-md-offset-3">
							<Select
								value={stampOptions.find(({ value }) => value === stamp)}
								placeholder={D.stampsPlaceholder}
								options={stampOptions}
								onChange={this.handleChangeStamp}
								searchable
							/>
						</div>
					</div>
					<div
						className="row text-center"
						style={{ marginTop: '5%', marginBottom: '5%' }}
					>
						<Button
							label={D.btnValid}
							action={this.onClickValidate}
							disabled={!role || !stamp}
							col={2}
							offset={5}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default LoginBasic;
