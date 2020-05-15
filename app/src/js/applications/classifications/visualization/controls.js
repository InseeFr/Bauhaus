import React from 'react';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, Button, ActionToolbar } from '@inseefr/wilco';
import D from 'js/i18n';

const ClassificationControls = props => {
	const location = props.history.location.pathname;
	const treeLocation = `${location}/tree`;

	return (
		<ActionToolbar>
			<ReturnButton action={goBack(props, `/classifications`)} />
			<Button key={D.btnTree} action={treeLocation} label={D.btnTree} col={3} />
		</ActionToolbar>
	);
};

export default withRouter(ClassificationControls);
