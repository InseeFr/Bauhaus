import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { dictionary } from 'js/utils/dictionary';

const Button = ({ action, label, disabled }) => {
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

function CollectionVisualizationControls({
	isValidated,
	id,
	handleValidation,
}) {
	let btns;
	const cancel = ['/collections', dictionary.buttons.return];
	const send = [`/collection/${id}/send`, dictionary.buttons.send];
	const validate = [handleValidation, dictionary.buttons.validate];
	const update = [`/collection/${id}/modify`, dictionary.buttons.modify];

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

CollectionVisualizationControls.propTypes = {
	id: PropTypes.string.isRequired,
	isValidated: PropTypes.bool.isRequired,
	handleValidation: PropTypes.func.isRequired,
};

export default CollectionVisualizationControls;
