import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, ActionToolbar } from '@inseefr/wilco';
import { goBack } from '@inseefr/wilco/src/utils/redirection';
import D from 'js/i18n';

function SeriesControls(props) {
	return (
		<ActionToolbar>
			<Button
				action={goBack(this.props, `/classifications/series`)}
				label={D.btnReturn}
			/>
		</ActionToolbar>
	);
}

SeriesControls.propTypes = {
	id: PropTypes.string,
};

export default withRouter(SeriesControls);
