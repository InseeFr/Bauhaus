import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, ActionToolbar } from '@inseefr/wilco';
import { goBack } from '@inseefr/wilco/src/utils/redirection';
import D from 'js/i18n';

function ClassificationControls(props) {
	const location = props.history.location.pathname;
	const nextLocation = location.replace('/tree', '');

	return (
		<ActionToolbar>
			<Button action={goBack(props, nextLocation)} label={D.btnReturn} />
		</ActionToolbar>
	);
}

ClassificationControls.propTypes = {
	id: PropTypes.string,
};

export default withRouter(ClassificationControls);
