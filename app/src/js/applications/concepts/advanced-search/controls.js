import React from 'react';
import { Button, ActionToolbar, ReturnButton } from '@inseefr/wilco';
import D from 'js/i18n';

export default ({ onClickReturn, initializeState }) => (
	<ActionToolbar>
		<ReturnButton action={onClickReturn} />
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
