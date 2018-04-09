import D from 'js/i18n';
import { DSURLToLabel, dateTimeToDateString } from 'js/utils/utils';

export const rowParams = {
	creations: [
		{
			dataField: 'label',
			label: D.conceptsTitle,
			width: '32%',
			isKey: true,
			dataSort: true,
		},
		{
			dataField: 'creator',
			label: D.creatorTitle,
			width: '17%',
			dataSort: true,
		},
		{
			dataField: 'disseminationStatus',
			label: D.disseminationStatusTitle,
			width: '17%',
			dataSort: true,
			dataFormat: DSURLToLabel,
		},
		{
			dataField: 'created',
			label: D.createdDateTitle,
			width: '17%',
			dataSort: true,
			dataFormat: dateTimeToDateString,
		},
		{
			dataField: 'validationStatus',
			label: D.isConceptValidTitle,
			width: '17%',
			dataSort: true,
		},
	],
	modifications: [
		{
			dataField: 'label',
			label: D.conceptsTitle,
			width: '32%',
			isKey: true,
			dataSort: true,
		},
		{
			dataField: 'creator',
			label: D.creatorTitle,
			width: '17%',
			dataSort: true,
		},
		{
			dataField: 'disseminationStatus',
			label: D.disseminationStatusTitle,
			width: '17%',
			dataSort: true,
			dataFormat: DSURLToLabel,
		},
		{
			dataField: 'modified',
			label: D.modifiedDateTitle,
			width: '17%',
			dataSort: true,
			dataFormat: dateTimeToDateString,
		},
		{
			dataField: 'validationStatus',
			label: D.isConceptValidTitle,
			width: '17%',
			dataSort: true,
		},
	],
};
