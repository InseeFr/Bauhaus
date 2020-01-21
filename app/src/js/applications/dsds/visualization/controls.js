import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import D from 'js/i18n';

const Controls = ({ dsdId }) => {
	const isLocal = process.env.REACT_APP_API === 'local';

	return (
		<div className="row btn-line action-toolbar">
			<Button label={D.btnReturn} action="/dsds" />
			{isLocal && <Button label={D.btnExport} action={console.log} />}
			<Button label={D.btnUpdate} action={`/dsds/${dsdId}/update`} />
			{isLocal && <Button label={D.btnDelete} action={console.log} />}
		</div>
	);
};

export default withRouter(Controls);
