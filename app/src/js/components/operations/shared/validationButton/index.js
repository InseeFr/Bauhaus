import D from 'js/i18n';
import React, { useCallback } from 'react';
import Button from 'js/components/shared/button';

export default ({ object = {}, callback, disabled = false }) => {
	const state = object.validationState || '';

	const clickHandler = useCallback(() => {
		console.log('hello');
		callback(object);
	}, []);

	if (state.indexOf('validated') >= 0) {
		return <Button label={D.btnValided} disabled action={() => {}} />;
	}
	return (
		<Button label={D.btnValid} action={clickHandler} disabled={disabled} />
	);
};
