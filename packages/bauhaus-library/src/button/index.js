import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { useContext } from 'react';

import { ThemeContext } from '../context';

import './button.scss';

const Button = ({ action, label, disabled, col = 2, offset }) => {
	const ctx = useContext(ThemeContext);
	const btnClass = `btn-${ctx}`;
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
			<button
				className={`btn ${btnClass} btn-lg col-md-12`}
				onClick={action}
				disabled={disabled}
			>
				{label}
			</button>
		);
	}
	const classes = [`col-md-${col}`];
	if (offset) {
		classes.push(`col-md-offset-${offset}`);
	}
	return <div className={classes.join(' ')}>{button}</div>;
};

Button.propTypes = {
	action: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	col: PropTypes.number,
	offset: PropTypes.number,
	disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default Button;
