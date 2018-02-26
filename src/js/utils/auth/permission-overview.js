import PropTypes from 'prop-types';
export const propTypes = PropTypes.shape({
	authType: PropTypes.string.isRequired,
	role: PropTypes.string.isRequired,
});
