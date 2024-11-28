import { ComponentProps } from 'react';

import { createAllDictionary } from '@utils/dictionnary';
import { useGoBack } from '@utils/hooks/useGoBack';

import { Button } from './button';

const { D } = createAllDictionary({
	btnReturn: {
		fr: 'Retour',
		en: 'Back',
	},
	btnReinitialize: {
		fr: 'Réinitialiser',
		en: 'Reinitialize',
	},
	btnUpdate: {
		fr: 'Modifier',
		en: 'Update',
	},
	btnDelete: {
		fr: 'Supprimer',
		en: 'Delete',
	},
	btnExport: {
		fr: 'Exporter',
		en: 'Export',
	},
	btnImport: {
		fr: 'Importer',
		en: 'Import',
	},
	btnValid: {
		fr: 'Publier',
		en: 'Publish',
	},
	btnNewMale: {
		fr: 'Nouveau',
		en: 'New',
	},
	btnCancel: {
		fr: 'Annuler',
		en: 'Cancel',
	},
	btnSave: {
		fr: 'Sauvegarder',
		en: 'Save',
	},
	btnDuplicate: {
		fr: 'Dupliquer',
		en: 'Duplicate',
	},
	btnClose: {
		fr: 'Fermer',
		en: 'Close',
	},
});

export const CloseButton = ({ onClick }: Readonly<{ onClick: () => void }>) => {
	return (
		<button type="button" className="btn btn-default btn-lg" onClick={onClick}>
			{D.btnClose}
		</button>
	);
};

export const CloseIconButton = ({
	onClick,
}: Readonly<{ onClick: () => void }>) => {
	return (
		<button type="button" className="close" onClick={onClick}>
			<span aria-hidden="true">&times;</span>
			<span className="sr-only">{D.btnClose}</span>
		</button>
	);
};

export const UpdateButton = (props: ComponentProps<typeof Button>) => {
	return <Button label={D.btnUpdate} {...props} />;
};

export const AbstractButton = (
	props: { icon?: unknown } & ComponentProps<typeof Button>,
) => {
	const p = {
		...props,
		label: (
			<>
				{props.icon}
				<span> {props.label || props.children}</span>
			</>
		),
	};
	return <Button {...p} />;
};

export const ReturnButton = (
	props: Omit<ComponentProps<typeof AbstractButton>, 'icon'>,
) => {
	return (
		<AbstractButton
			icon={
				<svg
					width="1em"
					height="1em"
					viewBox="0 0 16 16"
					className="bi bi-arrow-90deg-left"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M6.104 2.396a.5.5 0 0 1 0 .708L3.457 5.75l2.647 2.646a.5.5 0 1 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"
					/>
					<path
						fillRule="evenodd"
						d="M2.75 5.75a.5.5 0 0 1 .5-.5h6.5a2.5 2.5 0 0 1 2.5 2.5v5.5a.5.5 0 0 1-1 0v-5.5a1.5 1.5 0 0 0-1.5-1.5h-6.5a.5.5 0 0 1-.5-.5z"
					/>
				</svg>
			}
			{...props}
		>
			{D.btnReturn}
		</AbstractButton>
	);
};

export const ResetButton = (
	props: Omit<ComponentProps<typeof AbstractButton>, 'icon'>,
) => {
	return (
		<AbstractButton
			icon={
				<svg
					width="1em"
					height="1em"
					viewBox="0 0 16 16"
					className="bi bi-arrow-counterclockwise"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M12.83 6.706a5 5 0 0 0-7.103-3.16.5.5 0 1 1-.454-.892A6 6 0 1 1 2.545 5.5a.5.5 0 1 1 .91.417 5 5 0 1 0 9.375.789z"
					/>
					<path
						fillRule="evenodd"
						d="M7.854.146a.5.5 0 0 0-.708 0l-2.5 2.5a.5.5 0 0 0 0 .708l2.5 2.5a.5.5 0 1 0 .708-.708L5.707 3 7.854.854a.5.5 0 0 0 0-.708z"
					/>
				</svg>
			}
			{...props}
		>
			{D.btnReinitialize}
		</AbstractButton>
	);
};

export const ExportButton = (
	props: Omit<ComponentProps<typeof AbstractButton>, 'icon'>,
) => {
	return (
		<AbstractButton
			icon={
				<svg
					width="1em"
					height="1em"
					viewBox="0 0 16 16"
					className="bi bi-box-arrow-up"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M4.646 4.354a.5.5 0 0 0 .708 0L8 1.707l2.646 2.647a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 0 .708z"
					/>
					<path
						fillRule="evenodd"
						d="M8 11.5a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-1 0v9a.5.5 0 0 0 .5.5z"
					/>
					<path
						fillRule="evenodd"
						d="M2.5 14A1.5 1.5 0 0 0 4 15.5h8a1.5 1.5 0 0 0 1.5-1.5V7A1.5 1.5 0 0 0 12 5.5h-1.5a.5.5 0 0 0 0 1H12a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 0 0-1H4A1.5 1.5 0 0 0 2.5 7v7z"
					/>
				</svg>
			}
			{...props}
		>
			{D.btnExport}
		</AbstractButton>
	);
};

export const ImportButton = (
	props: Omit<ComponentProps<typeof AbstractButton>, 'icon'>,
) => {
	return (
		<AbstractButton
			icon={
				<svg
					width="1em"
					height="1em"
					viewBox="0 0 16 16"
					className="bi bi-box-arrow-in-up"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M4.646 7.854a.5.5 0 0 0 .708 0L8 5.207l2.646 2.647a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 0 .708z"
					/>
					<path
						fillRule="evenodd"
						d="M8 15a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-1 0v9a.5.5 0 0 0 .5.5z"
					/>
					<path
						fillRule="evenodd"
						d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 13 12h-1.5a.5.5 0 0 1 0-1H13a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h1.5a.5.5 0 0 1 0 1H3a1.5 1.5 0 0 1-1.5-1.5v-8z"
					/>
				</svg>
			}
			{...props}
		>
			{D.btnImport}
		</AbstractButton>
	);
};

export const PublishButton = (
	props: Omit<ComponentProps<typeof AbstractButton>, 'icon'>,
) => {
	return (
		<AbstractButton
			icon={
				<svg
					width="1em"
					height="1em"
					viewBox="0 0 16 16"
					className="bi bi-cloud-arrow-up"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"
					/>
					<path
						fillRule="evenodd"
						d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"
					/>
				</svg>
			}
			{...props}
		>
			{D.btnValid}
		</AbstractButton>
	);
};
export const NewButton = (
	props: Omit<ComponentProps<typeof AbstractButton>, 'icon'>,
) => {
	return (
		<AbstractButton
			icon={
				<svg
					width="1em"
					height="1em"
					viewBox="0 0 16 16"
					className="bi bi-plus"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"
					/>
					<path
						fillRule="evenodd"
						d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"
					/>
				</svg>
			}
			{...props}
		>
			{D.btnNewMale}
		</AbstractButton>
	);
};
export const CancelButton = ({
	action,
	...props
}: Readonly<{ action: string | (() => void) }>) => {
	const goBack = useGoBack();

	const handleAction = () => {
		if (typeof action === 'string') {
			goBack(action);
		} else if (typeof action === 'function') {
			action();
		}
	};

	return (
		<AbstractButton
			icon={
				<svg
					width="1em"
					height="1em"
					viewBox="0 0 16 16"
					className="bi bi-x"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
					/>
					<path
						fillRule="evenodd"
						d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
					/>
				</svg>
			}
			onClick={handleAction}
			{...props}
		>
			{D.btnCancel}
		</AbstractButton>
	);
};
export const SaveButton = (
	props: Omit<ComponentProps<typeof AbstractButton>, 'icon'>,
) => {
	return (
		<AbstractButton
			icon={
				<svg
					width="1em"
					height="1em"
					viewBox="0 0 16 16"
					className="bi bi-check"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"
					/>
				</svg>
			}
			{...props}
		>
			{D.btnSave}
		</AbstractButton>
	);
};

export const DuplicateButton = (
	props: Omit<ComponentProps<typeof AbstractButton>, 'icon'>,
) => {
	return (
		<AbstractButton
			icon={
				<svg
					width="1em"
					height="1em"
					viewBox="0 0 16 16"
					className="bi bi-files"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M3 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3z"
					/>
					<path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z" />
				</svg>
			}
			{...props}
		>
			{D.btnDuplicate}
		</AbstractButton>
	);
};

export const DeleteButton = (
	props: Omit<ComponentProps<typeof AbstractButton>, 'icon'>,
) => {
	return (
		<AbstractButton
			icon={
				<svg
					width="1em"
					height="1em"
					viewBox="0 0 16 16"
					className="bi bi-trash"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
					<path
						fillRule="evenodd"
						d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
					/>
				</svg>
			}
			{...props}
		>
			{D.btnDelete}
		</AbstractButton>
	);
};
