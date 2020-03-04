import D from 'js/i18n';
import React, { useCallback } from 'react';
import { PublishButton } from '@inseefr/wilco';

export default ({
	object = {},
	callback,
	disabled = false,
	label = D.btnValidatedF,
}) => {
	const state = object.validationState || '';

	const clickHandler = useCallback(() => {
		callback(object);
	}, [object, callback]);

	if (true || state.indexOf('Validated') >= 0) {
		return <PublishButton label={label} disabled action={() => {}} />;
	}
	return <PublishButton action={clickHandler} disabled={disabled} />;
};
