import React from 'react';
import {
	CancelButton,
	ErrorBloc,
	ActionToolbar,
	SaveButton,
} from '@inseefr/wilco';
import PropTypes from 'prop-types';
import { propTypes as generalPropTypes } from 'js/utils/collections/general';
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

Controls.propTypes = {
	general: generalPropTypes.isRequired,
	handleSave: PropTypes.func.isRequired,
	redirectCancel: PropTypes.func.isRequired,
};

export default Controls;
