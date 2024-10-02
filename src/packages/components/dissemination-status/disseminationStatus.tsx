import D from '../i18n';
import { useDisseminationStatusOptions } from '../../utils/hooks/disseminationStatus';
import { Select } from '../select-rmes';
import LabelRequired from '../label-required';

export const getDisseminationStatus = (disseminationStatus: string): string => {
	if (!disseminationStatus) {
		return '';
	}
	if (disseminationStatus.indexOf('PublicGenerique') > 0) {
		return D.disseminationStatus.DSPublicGeneriqueTitle;
	} else if (disseminationStatus.indexOf('PublicSpecifique') > 0) {
		return D.disseminationStatus.DSPublicSpecifiqueTitle;
	} else if (disseminationStatus.indexOf('Prive') > 0) {
		return D.disseminationStatus.DSPrivateTitle;
	}

	return '';
};

export const DisseminationStatusVisualisation = ({
	disseminationStatus,
}: Readonly<{
	disseminationStatus: string;
}>) => {
	return (
		<>
			{D.disseminationStatus.title} :{' '}
			{getDisseminationStatus(disseminationStatus)}
		</>
	);
};

type DisseminationStatusInputTypes = {
	value: string;
	handleChange: (value: string) => void;
	required: boolean;
};
export const DisseminationStatusInput = ({
	value,
	handleChange,
	required = false,
}: Readonly<DisseminationStatusInputTypes>) => {
	const disseminationStatusListOptions = useDisseminationStatusOptions();
	return (
		<>
			{required ? (
				<LabelRequired>{D.disseminationStatus.title}</LabelRequired>
			) : (
				<label>{D.disseminationStatus.title}</label>
			)}
			<Select
				placeholder={D.disseminationStatus.placeholder}
				value={disseminationStatusListOptions.find(
					({ value: v }) => v === value,
				)}
				options={disseminationStatusListOptions}
				onChange={handleChange}
			/>
		</>
	);
};
