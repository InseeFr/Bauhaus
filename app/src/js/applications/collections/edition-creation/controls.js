import React from 'react';
import {
	CancelButton,
	ErrorBloc,
	ActionToolbar,
	SaveButton,
} from '@inseefr/wilco';
import { validate } from './validation';

function Controls({
	general,
	collectionList,
	initialId,
	initialPrefLabelLg1,
	handleSave,
	redirectCancel,
}) {
	const message = validate(
		general,
		collectionList,
		initialId,
		initialPrefLabelLg1
	);

	return (
		<>
			<ActionToolbar>
				<CancelButton action={redirectCancel()} />
				<SaveButton action={handleSave} disabled={message} />
			</ActionToolbar>
			<ErrorBloc error={message} />
		</>
	);
}

export default Controls;
