import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, ActionToolbar } from '@inseefr/wilco';

function SeriesControls(props) {
	return (
		<ActionToolbar>
			<ReturnButton action={goBack(props, `/classifications/series`)} />
		</ActionToolbar>
	);
}

SeriesControls.propTypes = {
	id: PropTypes.string,
};

export default withRouter(SeriesControls);
