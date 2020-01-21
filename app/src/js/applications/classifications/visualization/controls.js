import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import { goBack } from 'bauhaus-library/src/utils/redirection';
import D from 'js/i18n';

const ClassificationControls = props => {
	const location = props.history.location.pathname;
	const treeLocation = `${location}/tree`;

	return (
		<div className="row btn-line action-toolbar">
			<Button
				key={D.btnReturn}
				action={goBack(props, `/classifications`)}
				label={D.btnReturn}
			/>
			<Button key={D.btnTree} action={treeLocation} label={D.btnTree} col={3} />
		</div>
	);
};

export default withRouter(ClassificationControls);
