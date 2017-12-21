import { dateTimeToDateString } from 'js/utils/utils';

export const rowParams = {
	creations: [
		{
			dataField: 'label',
			label: 'Collections',
			width: '32%',
			isKey: true,
			dataSort: true,
		},
		{
			dataField: 'nbMembers',
			label: 'Nombre de concepts',
			width: '17%',
			dataSort: true,
		},
		{
			dataField: 'creator',
			label: 'Propriétaire',
			width: '17%',
			dataSort: true,
		},
		{
			dataField: 'created',
			label: 'Date de création',
			width: '17%',
			dataSort: true,
			dataFormat: dateTimeToDateString,
		},
		{
			dataField: 'isValidated',
			label: 'Etat',
			width: '17%',
			dataSort: true,
		},
	],
	modifications: [
		{
			dataField: 'label',
			label: 'Collections',
			width: '32%',
			isKey: true,
			dataSort: true,
		},
		{
			dataField: 'nbMembers',
			label: 'Nombre de concepts',
			width: '17%',
			dataSort: true,
		},
		{
			dataField: 'creator',
			label: 'Propriétaire',
			width: '17%',
			dataSort: true,
		},
		{
			dataField: 'modified',
			label: 'Date de modification',
			width: '17%',
			dataSort: true,
			dataFormat: dateTimeToDateString,
		},
		{
			dataField: 'isValidated',
			label: 'Etat',
			width: '17%',
			dataSort: true,
		},
	],
};
