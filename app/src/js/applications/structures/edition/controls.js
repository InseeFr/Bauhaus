import React from 'react';
import { withRouter } from 'react-router-dom';
import {
	buildExtract,
	cleanId,
	ReturnButton,
	ActionToolbar,
	SaveButton,
} from '@inseefr/wilco';

const Controls = ({ creation, save, disabledSave, ...props }) => {
	const dsdId = buildExtract('dsdId')(props);
	return (
		<ActionToolbar>
			<ReturnButton
				action={creation ? '/structures' : `/structures/${cleanId(dsdId)}`}
			/>

			<SaveButton action={save} disabled={disabledSave} />
		</ActionToolbar>
	);
};

export default withRouter(Controls);
