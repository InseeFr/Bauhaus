import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import D from 'js/i18n';

const Controls = ({ dsdId }) => {
	const isLocal = process.env.REACT_APP_API === 'local';

	return (
		<div className="row btn-line">
			<Button label={D.btnReturn} action="/dsds" context="dsds" />
			<div className={`col-md-${isLocal ? '4' : '8'}`} />
			{isLocal && (
				<Button label={D.btnExport} action={console.log} context="dsds" />
			)}
			<Button
				label={D.btnUpdate}
				action={`/dsds/${dsdId}/update`}
				context="dsds"
			/>
			{isLocal && (
				<Button label={D.btnDelete} action={console.log} context="dsds" />
			)}
		</div>
	);
};

export default withRouter(Controls);
