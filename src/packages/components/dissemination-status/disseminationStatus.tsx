import { useDisseminationStatusOptions } from '../../utils/hooks/disseminationStatus';
import D from '../i18n';
import LabelRequired from '../label-required';
import { Select } from '../select-rmes';

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

interface DisseminationStatusInputTypes {
	value: string;
	handleChange: (value: string) => void;
	required: boolean;
	withLabel?: boolean;
}
export const DisseminationStatusInput = ({
	value,
	handleChange,
	required = false,
	withLabel = true,
}: Readonly<DisseminationStatusInputTypes>) => {
	const disseminationStatusListOptions = useDisseminationStatusOptions();
	return (
		<>
			{withLabel &&
				(required ? (
					<LabelRequired>{D.disseminationStatus.title}</LabelRequired>
				) : (
					<label>{D.disseminationStatus.title}</label>
				))}
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
