import React from 'react';
import Button from '../button';
import D from '../build-dictionary';

export const ReturnButton = props => {
	return <Button label={D.btnReturn} {...props} />;
};

export const UpdateButton = props => {
	return <Button label={D.btnUpdate} {...props} />;
};
export const AbstractButton = props => {
	const p = {
		...props,
		label: (
			<React.Fragment>
				<span
					className={`glyphicon glyphicon-${props.icon}`}
					aria-hidden="true"
				/>
				<span> {props.label || props.children}</span>
			</React.Fragment>
		),
	};
	return <Button {...p} />;
};

export const ExportButton = props => {
	return (
		<AbstractButton icon="export" {...props}>
			{D.btnExport}
		</AbstractButton>
	);
};

export const PublishButton = props => {
	return (
		<AbstractButton icon="ok" {...props}>
			{D.btnValid}
		</AbstractButton>
	);
};
export const NewButton = props => {
	return (
		<AbstractButton icon="plus" {...props}>
			{D.btnNewMale}
		</AbstractButton>
	);
};
export const CancelButton = props => {
	return (
		<AbstractButton icon="floppy-remove" {...props}>
			{D.btnCancel}
		</AbstractButton>
	);
};
export const SaveButton = props => {
	return (
		<AbstractButton icon="floppy-disk" {...props}>
			{D.btnSave}
		</AbstractButton>
	);
};

export const DuplicateButton = props => {
	return (
		<AbstractButton icon="duplicate" {...props}>
			{D.btnDuplicate}
		</AbstractButton>
	);
};

export default AbstractButton;
