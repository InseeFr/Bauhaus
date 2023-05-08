import React from 'react';
import { ReturnButton, Button, ActionToolbar } from '@inseefr/wilco';
import {
	ValidationButton,
	Auth,
	useRedirectWithDefault,
} from 'bauhaus-utilities';
import D from 'js/i18n';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const ClassificationControls = ({ classification, publish }) => {
	const location = useLocation();
	const goBack = useRedirectWithDefault('/classifications');
	const treeLocation = `${location.pathname}/tree`;

	return (
		<ActionToolbar>
			<ReturnButton action={goBack} />
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

ClassificationControls.propTypes = {
	classification: PropTypes.object.isRequired,
	publish: PropTypes.func.isRequired,
};

export default ClassificationControls;
