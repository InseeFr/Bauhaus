import D from 'js/i18n';
import React, { useCallback } from 'react';
import Button from 'js/components/shared/button';

export default ({ object = {}, callback, disabled = false }) => {
	const state = object.validationState || '';

	const clickHandler = useCallback(() => {
		callback(object);
	}, []);

	if (state.indexOf('Validated') >= 0) {
		return <Button label={D.btnValidated} disabled action={() => {}} />;
	}
	return (
		<Button label={D.btnValid} action={clickHandler} disabled={disabled} />
	);
};
