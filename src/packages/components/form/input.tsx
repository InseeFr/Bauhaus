import { ComponentProps, useId } from 'react';

import { ClientSideError } from '@components/errors-bloc';
import LabelRequired from '@components/label-required';

type BlockTypes = {
	label: string;
	error?: string;
	required?: boolean;
} & ComponentProps<'input'>;
export const GenericInputBlock = ({
	Component,
	label,
	error,
	required,
	...props
}: Readonly<BlockTypes & { Component: any }>) => {
	const id = useId();

	return (
		<>
			{required && <LabelRequired htmlFor={id}>{label}</LabelRequired>}
			{!required && <label htmlFor={id}>{label}</label>}
			<Component
				id={id}
				aria-describedby={`${id}-error`}
				aria-invalid={!!error}
				{...props}
			/>
			<ClientSideError id={`${id}-error`} error={error}></ClientSideError>
		</>
	);
};
export const TextInput = (props: Readonly<ComponentProps<'input'>>) => (
	<input type="text" className="form-control" {...props} />
);

export const TextInputBlock = (props: Readonly<BlockTypes>) => {
	return <GenericInputBlock {...props} Component={TextInput} />;
};

export const UrlInput = (props: Readonly<ComponentProps<'input'>>) => (
	<input type="url" className="form-control" {...props} />
);

export const UrlInputBlock = (props: Readonly<BlockTypes>) => {
	return <GenericInputBlock {...props} Component={UrlInput} />;
};

export const NumberInput = (props: Readonly<ComponentProps<'input'>>) => (
	<input type="number" className="form-control" {...props} />
);

export const NumberInputBlock = (props: Readonly<BlockTypes>) => {
	return <GenericInputBlock {...props} Component={NumberInput} />;
};
