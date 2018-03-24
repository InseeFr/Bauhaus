import D from 'js/i18n';
import { dateTimeToDateString } from 'js/utils/utils';

export const rowParams = {
	creations: [
		{
			dataField: 'label',
			label: D.collectionsTitle,
			width: '32%',
			isKey: true,
			dataSort: true,
		},
		{
			dataField: 'nbMembers',
			label: D.conceptsNumberTitle,
			width: '17%',
			dataSort: true,
		},
		{
			dataField: 'creator',
			label: D.creatorTitle,
			width: '17%',
			dataSort: true,
		},
		{
			dataField: 'created',
			label: D.createdDateTitle,
			width: '17%',
			dataSort: true,
			dataFormat: dateTimeToDateString,
		},
		{
			dataField: 'isValidated',
			label: D.isCollectionValidTitle,
			width: '17%',
			dataSort: true,
		},
	],
	modifications: [
		{
			dataField: 'label',
			label: D.collectionsTitle,
			width: '32%',
			isKey: true,
			dataSort: true,
		},
		{
			dataField: 'nbMembers',
			label: D.conceptsNumberTitle,
			width: '17%',
			dataSort: true,
		},
		{
			dataField: 'creator',
			label: D.creatorTitle,
			width: '17%',
			dataSort: true,
		},
		{
			dataField: 'modified',
			label: D.createdDateTitle,
			width: '17%',
			dataSort: true,
			dataFormat: dateTimeToDateString,
		},
		{
			dataField: 'isValidated',
			label: D.isCollectionValidTitle,
			width: '17%',
			dataSort: true,
		},
	],
};
