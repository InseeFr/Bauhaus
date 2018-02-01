import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { GESTIONNAIRE } from 'js/constants';
import { dictionary } from 'js/utils/dictionary';

const Button = ({ action, label }) => {
	let button;
	if (typeof action === 'string') {
		button = (
			<Link className="btn btn-primary btn-lg col-md-12" to={action}>
				{label}
			</Link>
		);
	} else {
		//if action is a function, it means a handler was passed in instead of an URL
		button = (
			<button className="btn btn-primary btn-lg col-md-12" onClick={action}>
				{label}
			</button>
		);
	}
	return <div className="col-md-2">{button}</div>;
};

const PlaceHolder = () => <div className="col-md-2" />;

Button.propTypes = {
	//handler or url
	action: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
	label: PropTypes.string.isRequired,
};

class ConceptVisualizationControls extends Component {
	render() {
		const {
			isValidated,
			isValidOutOfDate,
			conceptVersion,
			id,
			role,
			handleValidation,
		} = this.props;

		let btns;
		const isGestionnaire = role === GESTIONNAIRE;

		const cancel = [
			this.props.history.length === 1
				? `/concepts`
				: () => this.props.history.goBack(),
			dictionary.buttons.return,
		];
		const send = [`/concept/${id}/send`, dictionary.buttons.send];
		const validate = [handleValidation, dictionary.buttons.validate];
		const update = [`/concept/${id}/modify`, dictionary.buttons.modify];
		const compare =
			!conceptVersion || conceptVersion <= 1
				? null
				: [`/concept/${id}/compare`, dictionary.buttons.compare];

		if (!isGestionnaire) btns = [cancel, null, null, null, null, compare];
		else if (isValidOutOfDate) {
			btns = isValidated
				? [cancel, null, null, null, compare, send]
				: [cancel, null, compare, send, update, validate];
		} else {
			btns = isValidated
				? [cancel, null, null, compare, send, update]
				: [cancel, null, compare, send, update, validate];
		}
		return (
			<div className="row btn-line">
				{btns.map((btn, i) => {
					if (!btn) return <PlaceHolder key={i} />;
					const [action, label] = btn;
					return btn && <Button key={label} action={action} label={label} />;
				})}
			</div>
		);
	}
}

ConceptVisualizationControls.propTypes = {
	id: PropTypes.string.isRequired,
	isValidated: PropTypes.bool.isRequired,
	conceptVersion: PropTypes.string.isRequired,
	handleValidation: PropTypes.func.isRequired,
};

export default withRouter(ConceptVisualizationControls);
