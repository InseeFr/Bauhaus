import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, ActionToolbar } from 'bauhaus-library';
import buildExtract from 'bauhaus-library/src/utils/build-extract';
import { cleanId } from 'bauhaus-library/src/utils/string-utils';
import D from 'js/i18n';

const Controls = ({ creation, save, disabledSave, ...props }) => {
	const dsdId = buildExtract('dsdId')(props);
	return (
		<ActionToolbar>
			<Button
				label={D.btnReturn}
				action={creation ? '/dsds' : `/dsds/${cleanId(dsdId)}`}
			/>
			<Button label={D.btnSave} action={save} disabled={disabledSave} />
		</ActionToolbar>
	);
};

export default withRouter(Controls);
