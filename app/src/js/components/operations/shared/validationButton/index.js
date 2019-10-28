import D from 'js/i18n';
import React, { useCallback } from 'react';
import { PublishButton } from 'bauhaus-library';

export default ({ object = {}, callback, disabled = false }) => {
	const state = object.validationState || '';

	const clickHandler = useCallback(() => {
		callback(object);
	}, [object, callback]);

	if (state.indexOf('Validated') >= 0) {
		return <PublishButton label={D.btnValidated} disabled action={() => {}} />;
	}
	return <PublishButton action={clickHandler} disabled={disabled} />;
};
