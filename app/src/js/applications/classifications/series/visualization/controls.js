import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import { goBack } from 'bauhaus-library/src/utils/redirection';
import D from 'js/i18n';

function SeriesControls(props) {
	return (
		<div className="row btn-line action-toolbar">
			<Button
				action={goBack(this.props, `/classifications/series`)}
				label={D.btnReturn}
			/>
		</div>
	);
}

SeriesControls.propTypes = {
	id: PropTypes.string,
};

export default withRouter(SeriesControls);
