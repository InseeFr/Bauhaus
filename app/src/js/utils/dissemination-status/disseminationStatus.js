import D from 'js/i18n';
import { Stores } from 'js/utils';
import { LabelRequired, Select } from '@inseefr/wilco';
import React from 'react';

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

export const DisseminationStatusInput =
	Stores.DisseminationStatus.withDisseminationStatusListOptions(
		({ disseminationStatusListOptions = [], value, handleChange }) => {
			return (
				<>
					<LabelRequired>{D.disseminationStatusTitle}</LabelRequired>
					<Select
						className="form-control"
						placeholder={D.disseminationStatusPlaceholder}
						value={disseminationStatusListOptions.find(
							({ value: v }) => v === value
						)}
						options={disseminationStatusListOptions}
						onChange={handleChange}
						searchable={true}
					/>
				</>
			);
		}
	);
