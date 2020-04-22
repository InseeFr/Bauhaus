import React from 'react';
import { withRouter } from 'react-router-dom';
import {
	Button,
	ActionToolbar,
	ReturnButton,
	ExportButton,
} from '@inseefr/wilco';
import D from 'js/i18n';

const Controls = ({ dsdId }) => {
	const isLocal = process.env.REACT_APP_API === 'local';

	return (
		<ActionToolbar>
			<ReturnButton action="/structures" />
			{isLocal && <ExportButton action={console.log} />}
			<Button label={D.btnUpdate} action={`/structures/${dsdId}/update`} />
			{isLocal && <Button label={D.btnDelete} action={console.log} />}
		</ActionToolbar>
	);
};

export default withRouter(Controls);
