import React from 'react';
import PropTypes from 'prop-types';
import {
	CancelButton,
	ErrorBloc,
	ActionToolbar,
	SaveButton,
} from '@inseefr/wilco';
import { useRedirectWithDefault } from 'bauhaus-utilities';

const ConceptCreateControlLayout = ({
	message,
	handleSave,
	saveEnabled,
	redirectCancel,
}) => {
	const goBack = useRedirectWithDefault('concepts');
	return (
		<>
			<ActionToolbar>
				<CancelButton action={goBack} />
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
};

export default ConceptCreateControlLayout;
