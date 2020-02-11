import React from 'react';
import { Button, SaveButton } from '@inseefr/ui';
import D from 'js/i18n';

const Controls = ({ deleteAction, saveAction, disabledSave }) => {
	return (
		<div className="row">
			<div className="col-md-4 col-md-offset-1">
				<Button label={D.btnDelete} action={deleteAction} col={12} />
			</div>
			<div className="col-md-4 col-md-offset-2">
				<SaveButton action={saveAction} disabled={disabledSave} col={12} />
			</div>
		</div>
	);
};

export default Controls;
