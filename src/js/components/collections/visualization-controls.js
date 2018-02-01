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

class CollectionVisualizationControls extends Component {
	render() {
		const { isValidated, role, id, handleValidation } = this.props;
		let btns;
		const isGestionnaire = role === GESTIONNAIRE;

		const cancel = [`/collections`, dictionary.buttons.return];
		const send = isGestionnaire
			? [`/collection/${id}/send`, dictionary.buttons.send]
			: null;
		const validate = isGestionnaire
			? [handleValidation, dictionary.buttons.validate]
			: null;
		const update = isGestionnaire
			? [`/collection/${id}/modify`, dictionary.buttons.modify]
			: null;

		btns = isValidated
			? [cancel, null, null, null, send, update]
			: [cancel, null, null, send, update, validate];

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

CollectionVisualizationControls.propTypes = {
	id: PropTypes.string.isRequired,
	role: PropTypes.string.isRequired,
	isValidated: PropTypes.bool.isRequired,
	handleValidation: PropTypes.func.isRequired,
};

export default withRouter(CollectionVisualizationControls);
