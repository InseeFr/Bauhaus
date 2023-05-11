import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
	CancelButton,
	ActionToolbar,
	SaveButton,
} from '@inseefr/wilco';
import { GlobalClientSideErrorBloc } from 'bauhaus-utilities';
import D from '../../../../i18n/build-dictionary';

const ConceptCreateControlLayout = ({
	errors,
	handleSave,
	redirectCancel,
}) => {
	return (
		<>
			<ActionToolbar>
				<CancelButton action={redirectCancel} />
				<SaveButton action={handleSave} disabled={errors?.errorMessage?.length > 0} />
			</ActionToolbar>
			{ <GlobalClientSideErrorBloc clientSideErrors={errors?.errorMessage} D={D}/> }
		</>
	);
};

ConceptCreateControlLayout.propTypes = {
	errors: PropTypes.any,
	handleSave: PropTypes.func.isRequired,
	redirectCancel: PropTypes.func.isRequired,
};

export default withRouter(ConceptCreateControlLayout);
