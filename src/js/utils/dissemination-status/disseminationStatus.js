import D from '../../i18n';
import { LabelRequired } from '@inseefr/wilco';
import Select from '../../utils/components/select-rmes';
import { useDisseminationStatusOptions } from '../../new-architecture/utils/hooks/disseminationStatus';

export const getDisseminationStatus = (disseminationStatus) => {
	if (!disseminationStatus) {
		return '';
	}
	if (disseminationStatus.indexOf('PublicGenerique') > 0) {
		return D.DSPublicGeneriqueTitle;
	} else if (disseminationStatus.indexOf('PublicSpecifique') > 0) {
		return D.DSPublicSpecifiqueTitle;
	} else if (disseminationStatus.indexOf('Prive') > 0) {
		return D.DSPrivateTitle;
	}
};

export const DisseminationStatusVisualisation = ({ disseminationStatus }) => {
	return (
		<>
			{D.disseminationStatusTitle} :{' '}
			{getDisseminationStatus(disseminationStatus)}
		</>
	);
};

export const DisseminationStatusInput = ({ value, handleChange }) => {
	const disseminationStatusListOptions = useDisseminationStatusOptions();
	return (
		<>
			<LabelRequired>{D.disseminationStatusTitle}</LabelRequired>
			<Select
				placeholder={D.disseminationStatusPlaceholder}
				value={disseminationStatusListOptions.find(
					({ value: v }) => v === value
				)}
				options={disseminationStatusListOptions}
				onChange={handleChange}
			/>
		</>
	);
};
