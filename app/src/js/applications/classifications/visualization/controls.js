import React from 'react';
import { withRouter } from 'react-router-dom';
import { goBack, ReturnButton, Button, ActionToolbar } from '@inseefr/wilco';
import { ValidationButton, Auth } from 'bauhaus-utilities';
import D from 'js/i18n';
import PropTypes from 'prop-types';


const ClassificationControls = (props) => {
	const { classification, publish } = props;

	const location = props.history.location.pathname;
	const treeLocation = `${location}/tree`;

	return (
		<ActionToolbar>
			<ReturnButton action={goBack(props, `/classifications`)} />
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<ValidationButton
					object={classification}
					callback={publish}
				/>
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

export default withRouter(ClassificationControls);
