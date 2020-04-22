import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, ActionToolbar } from '@inseefr/wilco';

function LevelControls(props) {
	const { id } = props;

	return (
		<ActionToolbar>
			<ReturnButton
				action={goBack(props, `/classifications/classification/${id}`)}
			/>
		</ActionToolbar>
	);
}

LevelControls.propTypes = {
	id: PropTypes.string.isRequired,
};
export default withRouter(LevelControls);
