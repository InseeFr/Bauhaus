import PropTypes from 'prop-types';
export const propTypes = PropTypes.arrayOf(
	PropTypes.shape({
		id: PropTypes.string.isRequired,
		sourceId: PropTypes.string.isRequired,
		sourceLabelLg1: PropTypes.string.isRequired,
		sourceLabelLg2: PropTypes.string,
		targetId: PropTypes.string.isRequired,
		targetLabelLg1: PropTypes.string.isRequired,
		targetLabelLg2: PropTypes.string,
	})
);
