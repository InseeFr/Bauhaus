import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
/**
 *
 * If `handleClick` is not provided, no icon will be shown and no action will be
 * performed on click.
 *
 */
function Item({ id, label, logo, to, handleClick }) {
	if (handleClick) {
		return (
			<li className="list-group-item" onClick={() => handleClick(id)}>
				{logo} {label}
			</li>
		);
	}
	if (to) {
		return (
			<li className="list-group-item">
				<Link to={to}>{label}</Link>
			</li>
		);
	}
	return <li className="list-group-item">{label}</li>;
}

Item.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	logo: PropTypes.element,
	to: PropTypes.string,
	handleClick: PropTypes.func,
};
export default Item;
