import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, ActionToolbar } from '@inseefr/wilco';
import D from 'js/i18n';

const Controls = ({ dsdId }) => {
	const isLocal = process.env.REACT_APP_API === 'local';

	return (
		<ActionToolbar>
			<Button label={D.btnReturn} action="/dsds" />
			{isLocal && <Button label={D.btnExport} action={console.log} />}
			<Button label={D.btnUpdate} action={`/dsds/${dsdId}/update`} />
			{isLocal && <Button label={D.btnDelete} action={console.log} />}
		</ActionToolbar>
	);
};

export default withRouter(Controls);
