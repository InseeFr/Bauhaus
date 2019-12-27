import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import { goBack } from 'bauhaus-library/src/utils/redirection';
import D from 'js/i18n';

function ClassificationControls(props) {
	const location = props.history.location.pathname;
	const nextLocation = location.replace('/tree', '');

	return (
		<div className="row btn-line action-toolbar">
			<Button
				action={goBack(props, nextLocation)}
				label={D.btnReturn}
				context="classifications"
			/>
		</div>
	);
}

ClassificationControls.propTypes = {
	id: PropTypes.string,
};

export default withRouter(ClassificationControls);
