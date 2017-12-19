import { DSURLToLabel, dateTimeToDateString } from 'js/utils/utils';

export const rowParams = {
	creations: [
		{
			dataField: 'label',
			label: 'Concepts',
			width: '32%',
			isKey: true,
			dataSort: true,
		},
		{
			dataField: 'creator',
			label: 'Propriétaire',
			width: '17%',
			dataSort: true,
		},
		{
			dataField: 'disseminationStatus',
			label: 'Statut de diffusion',
			width: '17%',
			dataSort: true,
			dataFormat: DSURLToLabel,
		},
		{
			dataField: 'created',
			label: 'Date de création',
			width: '17%',
			dataSort: true,
			dataFormat: dateTimeToDateString,
		},
		{
			dataField: 'validationStatus',
			label: 'Etat',
			width: '17%',
			dataSort: true,
		},
	],
	modifications: [
		{
			dataField: 'label',
			label: 'Concepts',
			width: '32%',
			isKey: true,
			dataSort: true,
		},
		{
			dataField: 'creator',
			label: 'Propriétaire',
			width: '17%',
			dataSort: true,
		},
		{
			dataField: 'disseminationStatus',
			label: 'Statut de diffusion',
			width: '17%',
			dataSort: true,
			dataFormat: DSURLToLabel,
		},
		{
			dataField: 'modified',
			label: 'Date de modification',
			width: '17%',
			dataSort: true,
			dataFormat: dateTimeToDateString,
		},
		{
			dataField: 'validationStatus',
			label: 'Etat',
			width: '17%',
			dataSort: true,
		},
	],
};
