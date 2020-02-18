import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { goBack, Button, ActionToolbar } from '@inseefr/wilco';
import D from 'js/i18n';

function LevelControls(props) {
	const { id } = props;

	return (
		<ActionToolbar>
			<Button
				action={goBack(props, `/classifications/classification/${id}`)}
				label={D.btnReturn}
			/>
		</ActionToolbar>
	);
}

LevelControls.propTypes = {
	id: PropTypes.string.isRequired,
};
export default withRouter(LevelControls);
