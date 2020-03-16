import React, { useCallback } from 'react';
import { PublishButton } from '@inseefr/wilco';

export default ({ object = {}, callback, disabled = false }) => {
	const state = object.validationState || '';

	const clickHandler = useCallback(() => {
		callback(object);
	}, [object, callback]);

	if (state.indexOf('Validated') >= 0) {
		return null;
	}
	return <PublishButton action={clickHandler} disabled={disabled} />;
};
