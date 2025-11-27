import { ComponentProps } from 'react';
import { useV2StampsOptions } from '../../../utils/hooks/stamps';
import D, { D1 } from '../../i18n';
import { Select } from '../../ui/select';
import { useOrganizations } from '../../../utils/hooks/organizations';

const DefaultStampsInput = ({
	value,
	onChange,
	multi = false,
	required = true,
	lang = 'first',
	labelSingle,
	labelMulti,
	options,
}: Readonly<{
	value: string | string[];
	onChange: (value: string | string[]) => void;
	multi?: boolean;
	required?: boolean;
	lang: 'first' | 'default';
	labelSingle: string;
	labelMulti: string;
	options: { value: string; label: string }[];
}>) => {
	let creatorsArray;
	if (multi) {
		creatorsArray = Array.isArray(value) && value.length > 0 ? value : [];
	} else {
		creatorsArray = value ? value : undefined;
	}

	const Dictionnary = lang === 'first' ? D1 : D;
	const label = !multi ? labelSingle : labelMulti;

	return (
		<Select
			label={label}
			placeholder={Dictionnary.stampsPlaceholder}
			value={creatorsArray}
			options={options}
			onChange={onChange}
			multi={multi}
			required={required}
			filter={true}
		/>
	);
};
// @depreated
export const StampsInput = (
	props: Readonly<Omit<ComponentProps<typeof DefaultStampsInput>, 'options'>>,
) => {
	const stampsOptions = useV2StampsOptions();
	return <DefaultStampsInput {...props} options={stampsOptions} />;
};

export const OrganisationInput = (
	props: Readonly<Omit<ComponentProps<typeof DefaultStampsInput>, 'options'>>,
) => {
	const { data: organisations } = useOrganizations();
	return (
		<DefaultStampsInput
			{...props}
			options={organisations.map((o) => ({ value: o.iri, label: o.label }))}
		/>
	);
};
