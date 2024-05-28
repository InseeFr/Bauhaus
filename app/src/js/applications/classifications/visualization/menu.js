import React from 'react';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, Button, ActionToolbar } from '@inseefr/wilco';
import { ValidationButton, Auth } from 'js/utils';
import D from 'js/i18n';

const ClassificationControls = (props) => {
	const { classification, publish } = props;

	const location = props.history.location.pathname;
	const treeLocation = `${location}/tree`;

	return (
		<ActionToolbar>
			<ReturnButton action={goBack(props, `/classifications`)} />
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<ValidationButton object={classification} callback={publish} />
			</Auth.AuthGuard>
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<Button
					action={`/classifications/classification/${classification.id}/modify`}
					label={D.btnUpdate}
				/>
			</Auth.AuthGuard>
			<Button key={D.btnTree} action={treeLocation} label={D.btnTree} col={3} />
		</ActionToolbar>
	);
};

export default withRouter(ClassificationControls);
