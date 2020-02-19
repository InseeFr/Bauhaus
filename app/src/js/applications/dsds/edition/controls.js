import React from 'react';
import { withRouter } from 'react-router-dom';
import {
	buildExtract,
	cleanId,
	Button,
	ActionToolbar,
	SaveButton,
} from '@inseefr/wilco';
import D from 'js/i18n';

const Controls = ({ creation, save, disabledSave, ...props }) => {
	const dsdId = buildExtract('dsdId')(props);
	return (
		<ActionToolbar>
			<Button
				label={D.btnReturn}
				action={creation ? '/dsds' : `/dsds/${cleanId(dsdId)}`}
			/>

			<SaveButton action={save} disabled={disabledSave} />
		</ActionToolbar>
	);
};

export default withRouter(Controls);
