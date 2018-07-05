import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './button.css';

const Button = ({ action, label, context }) => {
	const btnClass = context ? `btn-${context}` : 'btn-concepts';
	let button;
	if (typeof action === 'string') {
		button = (
			<Link className={`btn ${btnClass} btn-lg col-md-12`} to={action}>
				{label}
			</Link>
		);
	} else {
		//if action is a function, it means a handler was passed in instead of an URL
		button = (
			<button className={`btn ${btnClass} btn-lg col-md-12`} onClick={action}>
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
	context: PropTypes.oneOf(['', 'concepts', 'classifications', 'operations']),
};

export default Button;
