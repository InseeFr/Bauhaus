import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, ActionToolbar } from '@inseefr/wilco';

function ClassificationControls(props) {
	const location = props.history.location.pathname;
	const nextLocation = location.replace('/items', '');

	return (
		<ActionToolbar>
			<ReturnButton action={goBack(props, nextLocation)} />
		</ActionToolbar>
	);
}

ClassificationControls.propTypes = {
	id: PropTypes.string,
};

export default withRouter(ClassificationControls);
