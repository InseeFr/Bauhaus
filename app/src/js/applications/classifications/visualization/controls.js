import React from 'react';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, Button, ActionToolbar } from '@inseefr/wilco';
import { ValidationButton } from 'bauhaus-utilities';
import check from 'js/utils/auth';
import D from 'js/i18n';

const ClassificationControls = (props) => {
	const location = props.history.location.pathname;
	const treeLocation = `${location}/tree`;
	const { authType, roles } = props.permission;
	const authImpl = check(authType);

	return (
		<ActionToolbar>
			<ReturnButton action={goBack(props, `/classifications`)} />
			{authImpl.isAdmin(roles) && (
				<ValidationButton
					object={props.classification}
					callback={props.publish}
				/>
			)}
			<Button key={D.btnTree} action={treeLocation} label={D.btnTree} col={3} />
		</ActionToolbar>
	);
};

export default withRouter(ClassificationControls);
