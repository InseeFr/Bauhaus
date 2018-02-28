import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectRmes from 'js/components/shared/select-rmes';
import { dictionary } from 'js/utils/dictionary';

class LoginBasic extends Component {
	constructor(props) {
		super();
		this.state = { role: '', stamp: '' };
		this.handleChangeRole = role => this.setState({ role });
		this.handleChangeStamp = stamp => this.setState({ stamp });
		this.onClickValidate = e => {
			const { role, stamp } = this.state;
			props.checkAuth({ role, stamp });
		};
	}

	render() {
		const { roleList, stampList } = this.props;
		const { role, stamp } = this.state;
		return (
			<div>
				<div className="centered page-title">
					<h1>{dictionary.app.title}</h1>
				</div>
				<div className="container" style={{ marginTop: '10%' }}>
					<div className="row centered">
						<h3>Choisir un profil utilisateur :</h3>
					</div>
					<div className="row" style={{ marginTop: '2%' }}>
						<div className="col-md-6 col-md-offset-3">
							<SelectRmes
								value={role}
								placeholder="Choisir un rôle ..."
								options={roleList.map(role => ({
									label: role.label,
									value: role.id,
								}))}
								onChange={this.handleChangeRole}
								searchable
							/>
						</div>
					</div>
					<div className="row" style={{ marginTop: '2%' }}>
						<div className="col-md-6 col-md-offset-3">
							<SelectRmes
								value={stamp}
								placeholder="Choisir un timbre ..."
								options={stampList.map(stamp => ({
									label: stamp,
									value: stamp,
								}))}
								onChange={this.handleChangeStamp}
								searchable
							/>
						</div>
					</div>
					<div
						className="row centered"
						style={{ marginTop: '5%', marginBottom: '5%' }}
					>
						<button
							className="btn btn-primary btn-lg col-md-2 col-md-offset-5"
							onClick={this.onClickValidate}
							disabled={!role || !stamp}
						>
							{dictionary.buttons.validate}
						</button>
					</div>
				</div>
			</div>
		);
	}
}

LoginBasic.propTypes = {
	roleList: PropTypes.array.isRequired,
	stampList: PropTypes.array.isRequired,
	checkAuth: PropTypes.func.isRequired,
};
export default LoginBasic;
