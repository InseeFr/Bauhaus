import PropTypes from 'prop-types';
export const propTypes = PropTypes.arrayOf(
	PropTypes.shape({
		id: PropTypes.string.isRequired,
		labelLg1: PropTypes.string.isRequired,
		labelLg2: PropTypes.string,
		depth: PropTypes.string.isRequired,
	})
);
