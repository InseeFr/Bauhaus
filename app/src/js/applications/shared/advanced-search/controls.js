import React from 'react';
import { Button } from 'bauhaus-library';
import D from 'js/i18n';

export default ({ onClickReturn, initializeState }) => (
	<div className="row btn-line action-toolbar">
		<Button
			label={
				<>
					<span className="glyphicon glyphicon-menu-left" aria-hidden="true" />
					<span> {D.btnReturn}</span>
				</>
			}
			action={onClickReturn}
		/>
		<Button
			label={
				<>
					<span className="glyphicon glyphicon-flash" aria-hidden="true" />
					<span> {D.btnReinitialize}</span>
				</>
			}
			action={initializeState}
			offset={8}
		/>
	</div>
);
