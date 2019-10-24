import React from 'react';
import { Button } from 'bauhaus-library';
import D from 'js/i18n';

export const AbstractButton = props => {
	return (
		<Button
			label={
				<React.Fragment>
					<span
						className={`glyphicon glyphicon-${props.icon}`}
						aria-hidden="true"
					/>
					<span> {props.children}</span>
				</React.Fragment>
			}
			{...props}
		/>
	);
};

export const CancelButton = props => (
	<AbstractButton icon="floppy-remove" {...props}>
		{D.btnCancel}
	</AbstractButton>
);
export const SaveButton = props => (
	<AbstractButton icon="floppy-disk" {...props}>
		{D.btnSave}
	</AbstractButton>
);

export const DuplicateButton = props => (
	<AbstractButton icon="duplicate" {...props}>
		{D.btnDuplicate}
	</AbstractButton>
);

export default AbstractButton;
