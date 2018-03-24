import React, { Component } from 'react';
import { connect } from 'react-redux';
import { checkAuth } from 'js/actions/app';
import InputRmes from 'js/components/shared/input-rmes';
import D from 'js/i18n';

class Auth extends Component {
	constructor(props) {
		super();
		this.state = { password: '' };
		this.handlePassword = password => this.setState({ password });
		this.onClickValidate = e => {
			this.props.checkAuth(this.state.password);
			this.setState({ password: '' });
		};
	}

	render() {
		return (
			<div>
				<div className="centered page-title">
					<h1>{D.welcome}</h1>
				</div>
				<div className="container" style={{ marginTop: '10%' }}>
					<div className="row centered">
						<h3>{D.passwordTitle}</h3>
					</div>
					<div className="row">
						<div className="col-md-6 col-md-offset-3">
							<InputRmes
								value={this.state.password}
								handleChange={this.handlePassword}
								password
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
							{D.btnValid}
						</button>
					</div>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = {
	checkAuth,
};

export default connect(undefined, mapDispatchToProps)(Auth);
