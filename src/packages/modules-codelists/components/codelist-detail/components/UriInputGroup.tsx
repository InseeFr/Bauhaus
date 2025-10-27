import React from 'react';
import { InputText } from 'primereact/inputtext';
import LabelRequired from '@components/label-required';
import { ClientSideError } from '@components/errors-bloc';

interface UriInputGroupProps {
	id: string;
	name: string;
	label: string;
	prefix: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	error?: string;
}

export const UriInputGroup = ({
	id,
	name,
	label,
	prefix,
	value,
	onChange,
	disabled = false,
	error,
}: Readonly<UriInputGroupProps>) => {
	return (
		<div className="col-md-12 form-group">
			<LabelRequired htmlFor={id}>{label}</LabelRequired>
			<div className="p-inputgroup flex-1">
				<span className="p-inputgroup-addon">{prefix}</span>
				<InputText
					id={id}
					name={name}
					onChange={onChange}
					value={value}
					disabled={disabled}
					aria-invalid={!!error}
					aria-describedby={error ? `${id}-error` : undefined}
				/>
			</div>
			<ClientSideError id={`${id}-error`} error={error} />
		</div>
	);
};
