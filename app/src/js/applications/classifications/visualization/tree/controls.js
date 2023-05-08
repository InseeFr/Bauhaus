import React from 'react';
import PropTypes from 'prop-types';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useLocation } from 'react-router-dom';
import { useRedirectWithDefault } from 'bauhaus-utilities';

function ClassificationControls() {
	const location = useLocation();
	const goBack = useRedirectWithDefault(location.pathname.replace('/tree', ''));

	return (
		<ActionToolbar>
			<ReturnButton action={goBack} />
		</ActionToolbar>
	);
}

ClassificationControls.propTypes = {
	id: PropTypes.string,
};

export default ClassificationControls;
