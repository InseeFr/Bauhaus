import React from 'react';
import { ReturnButton, Button, ActionToolbar } from '@inseefr/wilco';
import { ValidationButton, Auth } from 'bauhaus-utilities';
import D from 'js/i18n';
import { useGoBack } from '../../../hooks/hooks';
import { useHistory } from 'react-router-dom';

const ClassificationControls = ({ classification, publish }) => {
	const goBack = useGoBack();
	const history = useHistory();

	const location = history.location.pathname;
	const treeLocation = `${location}/tree`;

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack(`/classifications`)} />
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

export default ClassificationControls;
