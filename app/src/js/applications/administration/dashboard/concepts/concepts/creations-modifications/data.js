import D from 'js/i18n';
import { DSURLToLabel } from '@inseefr/ui/src/utils/dissemination-status-convertor';
import { stringToDate } from 'js/utils/moment';

export const rowParams = {
	creations: [
		{
			dataField: 'label',
			text: D.conceptsTitle,
			width: '32%',
			isKey: true,
			sort: true,
		},
		{
			dataField: 'creator',
			text: D.creatorTitle,
			width: '17%',
			sort: true,
		},
		{
			dataField: 'disseminationStatus',
			text: D.disseminationStatusTitle,
			width: '17%',
			sort: true,
			formatter: DSURLToLabel,
		},
		{
			dataField: 'created',
			text: D.createdDateTitle,
			width: '17%',
			sort: true,
			formatter: d => stringToDate(d),
		},
		{
			dataField: 'validationStatus',
			text: D.isConceptValidTitle,
			width: '17%',
			sort: true,
		},
	],
	modifications: [
		{
			dataField: 'label',
			text: D.conceptsTitle,
			width: '32%',
			isKey: true,
			sort: true,
		},
		{
			dataField: 'creator',
			text: D.creatorTitle,
			width: '17%',
			sort: true,
		},
		{
			dataField: 'disseminationStatus',
			text: D.disseminationStatusTitle,
			width: '17%',
			sort: true,
			formatter: DSURLToLabel,
		},
		{
			dataField: 'modified',
			text: D.modifiedDateTitle,
			width: '17%',
			sort: true,
			formatter: d => stringToDate(d),
		},
		{
			dataField: 'validationStatus',
			text: D.isConceptValidTitle,
			width: '17%',
			sort: true,
		},
	],
};
