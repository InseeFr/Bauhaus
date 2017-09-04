import PropTypes from 'prop-types';
export const propTypes = PropTypes.arrayOf(
	PropTypes.shape({
		prefLabelLg1: PropTypes.string.isRequired,
		prefLabelLg2: PropTypes.string.isRequired,
	})
);
