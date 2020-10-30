import React, { useCallback } from 'react';
import { PublishButton } from '@inseefr/wilco';

const ValidationButton = ({ object = {}, callback, disabled = false }) => {
	const state = object.validationState || '';

	const clickHandler = useCallback(() => {
		callback(object);
	}, [object, callback]);

	if (state.indexOf('Validated') >= 0) {
		return null;
	}
	return <PublishButton action={clickHandler} disabled={disabled} />;
};

export default ValidationButton;
