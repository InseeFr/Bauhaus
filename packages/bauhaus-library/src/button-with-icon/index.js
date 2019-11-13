import React, { useContext } from 'react';
import Button from '../button';
import { I18NContext } from '../context';
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
	const D = useContext(I18NContext);
	return (
		<AbstractButton icon="export" {...props}>
			{D.btnExport}
		</AbstractButton>
	);
};

export const PublishButton = props => {
	const D = useContext(I18NContext);
	return (
		<AbstractButton icon="ok" {...props}>
			{D.btnValid}
		</AbstractButton>
	);
};
export const NewButton = props => {
	const D = useContext(I18NContext);
	return (
		<AbstractButton icon="plus" {...props}>
			{D.btnNewMale}
		</AbstractButton>
	);
};
export const CancelButton = props => {
	const D = useContext(I18NContext);
	return (
		<AbstractButton icon="floppy-remove" {...props}>
			{D.btnCancel}
		</AbstractButton>
	);
};
export const SaveButton = props => {
	const D = useContext(I18NContext);
	return (
		<AbstractButton icon="floppy-disk" {...props}>
			{D.btnSave}
		</AbstractButton>
	);
};

export const DuplicateButton = props => {
	const D = useContext(I18NContext);
	return (
		<AbstractButton icon="duplicate" {...props}>
			{D.btnDuplicate}
		</AbstractButton>
	);
};

export default AbstractButton;
