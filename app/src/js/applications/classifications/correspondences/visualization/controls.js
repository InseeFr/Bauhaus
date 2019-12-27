import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import { goBack } from 'bauhaus-library/src/utils/redirection';
import D from 'js/i18n';

function CorrespondenceControls(props) {
	return (
		<div className="row btn-line action-toolbar">
			<Button
				action={goBack(props, `/classifications/correspondences`)}
				label={D.btnReturn}
			/>
		</div>
	);
}

export default withRouter(CorrespondenceControls);
