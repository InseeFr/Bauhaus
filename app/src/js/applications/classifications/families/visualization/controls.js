import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import { goBack } from 'bauhaus-library/src/utils/redirection';
import D from 'js/i18n';

function FamilyControls(props) {
	return (
		<div className="row btn-line action-toolbar">
			<Button
				action={goBack(props, `/classifications/families`)}
				label={D.btnReturn}
			/>
		</div>
	);
}

export default withRouter(FamilyControls);
