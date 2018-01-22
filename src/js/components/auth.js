import React, { Component } from 'react';
import { checkAuth } from 'js/actions/app';
import { connect } from 'react-redux';
import InputRmes from 'js/components/shared/input-rmes';
import { dictionary } from 'js/utils/dictionary';

class Auth extends Component {
	constructor(props) {
		super();
		this.state = { password: '' };
		this.handlePassword = password => this.setState({ password });
		this.onClickValidate = e => {
			this.props
				.checkAuth(this.state.password)
				.then(res => this.props.updateLogin(res.payload));
			this.setState({ password: '' });
		};
	}

	render() {
		return (
			<div>
				<div className="centered page-title">
					<h1>{dictionary.app.title}</h1>
				</div>
				<div className="container" style={{ marginTop: '10%' }}>
					<div className="row centered">
						<h3>Mot de passe :</h3>
					</div>
					<div className="row">
						<div className="col-md-6 col-md-offset-3">
							<InputRmes
								value={this.state.password}
								handleChange={this.handlePassword}
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
						>
							{dictionary.buttons.validate}
						</button>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.app.auth,
});

const mapDispatchToProps = {
	checkAuth,
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
