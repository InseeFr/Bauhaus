import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
	CancelButton,
	ErrorBloc,
	ActionToolbar,
	SaveButton,
} from '@inseefr/wilco';

const ConceptCreateControlLayout = ({
	message,
	handleSave,
	saveEnabled,
	redirectCancel,
}) => {
	return (
		<>
			<ActionToolbar>
				<CancelButton action={redirectCancel} />
				<SaveButton action={handleSave} disabled={!saveEnabled} />
			</ActionToolbar>
			<ErrorBloc error={message} />
		</>
	);
};

ConceptCreateControlLayout.propTypes = {
	message: PropTypes.string,
	saveEnabled: PropTypes.bool.isRequired,
	handleSave: PropTypes.func.isRequired,
	redirectCancel: PropTypes.func.isRequired,
};

export default withRouter(ConceptCreateControlLayout);
