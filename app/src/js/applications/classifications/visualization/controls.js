import React from 'react';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, Button, ActionToolbar } from '@inseefr/wilco';
import { ValidationButton } from 'bauhaus-utilities';
import D from 'js/i18n';

const ClassificationControls = (props) => {
	const location = props.history.location.pathname;
	const treeLocation = `${location}/tree`;
	const { authType } = props.permission;

	return (
		<ActionToolbar>
			<ReturnButton action={goBack(props, `/classifications`)} />
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<ValidationButton
					object={props.classification}
					callback={props.publish}
				/>
			</Auth.AuthGuard>
			<Button key={D.btnTree} action={treeLocation} label={D.btnTree} col={3} />
		</ActionToolbar>
	);
};

export default withRouter(ClassificationControls);
