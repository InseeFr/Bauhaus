import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import { goBack } from 'bauhaus-library/src/utils/redirection';
import D from 'js/i18n';

function LevelControls(props) {
	const { id } = props;

	return (
		<div className="row btn-line action-toolbar">
			<Button
				action={goBack(props, `/classifications/classification/${id}`)}
				label={D.btnReturn}
			/>
		</div>
	);
}

LevelControls.propTypes = {
	id: PropTypes.string.isRequired,
};
export default withRouter(LevelControls);
