import PropTypes from 'prop-types';
export const propTypes = PropTypes.shape({
	authType: PropTypes.string.isRequired,
	roles: PropTypes.array.isRequired,
});
