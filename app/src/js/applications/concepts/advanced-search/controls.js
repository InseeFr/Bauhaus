import React from 'react';
import { Button, ActionToolbar } from '@inseefr/ui';
import D from 'js/i18n';

export default ({ onClickReturn, initializeState }) => (
	<ActionToolbar>
		<Button
			label={
				<React.Fragment>
					<span className="glyphicon glyphicon-menu-left" aria-hidden="true" />
					<span> {D.btnReturn}</span>
				</React.Fragment>
			}
			action={onClickReturn}
		/>
		<Button
			label={
				<React.Fragment>
					<span className="glyphicon glyphicon-flash" aria-hidden="true" />
					<span> {D.btnReinitialize}</span>
				</React.Fragment>
			}
			action={initializeState}
			offset={8}
		/>
	</ActionToolbar>
);
