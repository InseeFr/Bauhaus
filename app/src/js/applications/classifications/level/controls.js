import React from 'react';
import PropTypes from 'prop-types';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useRedirectWithDefault } from 'bauhaus-utilities';

function LevelControls({ id }) {
	const goBack = useRedirectWithDefault(
		`/classifications/classification/${id}`
	);
	return (
		<ActionToolbar>
			<ReturnButton action={goBack} />
		</ActionToolbar>
	);
}

LevelControls.propTypes = {
	id: PropTypes.string.isRequired,
};
export default LevelControls;
