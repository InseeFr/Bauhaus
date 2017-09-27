import React from 'react';
import PropTypes from 'prop-types';
/**
 * A collection entry with a list of collections
 *
 * If `handleClick` is not provided, no icon will be shown and no action will be
 * performed on click.
 *
 */
function AgentItem({ id, label, logo, to, handleClick }) {
	return (
		<li className="list-group-item" onClick={() => handleClick(id)}>
			{logo} {label}
		</li>
	);
}

AgentItem.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	logo: PropTypes.element,
	to: PropTypes.string,
	handleClick: PropTypes.func,
};
export default AgentItem;
