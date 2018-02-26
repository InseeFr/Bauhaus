import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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

Button.propTypes = {
	//handler or url
	action: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
	label: PropTypes.string.isRequired,
};

export default Button;
