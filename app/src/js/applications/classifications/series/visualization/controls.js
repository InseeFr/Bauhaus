import React from 'react';
import PropTypes from 'prop-types';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';
import { useRedirectWithDefault } from 'bauhaus-utilities';

function SeriesControls() {
	const goBack = useRedirectWithDefault(`/classifications/series`);
	return (
		<ActionToolbar>
			<ReturnButton action={goBack} />
		</ActionToolbar>
	);
}

SeriesControls.propTypes = {
	id: PropTypes.string,
};

export default SeriesControls;
