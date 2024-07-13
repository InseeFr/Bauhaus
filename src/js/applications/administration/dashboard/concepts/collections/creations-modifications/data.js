import D from '../../../../../../i18n';
import { DateItem } from '../../../../../../utils';

export const rowParams = {
	creations: [
		{
			dataField: 'label',
			text: D.collectionsTitle,
			width: '32%',
			isKey: true,
			sort: true,
		},
		{
			dataField: 'nbMembers',
			text: D.conceptsNumberTitle,
			width: '17%',
			sort: true,
		},
		{
			dataField: 'creator',
			text: D.creatorTitle,
			width: '17%',
			sort: true,
		},
		{
			dataField: 'created',
			text: D.createdDateTitle,
			width: '17%',
			sort: true,
			formatter: (d) => <DateItem date={d} />,
		},
		{
			dataField: 'isValidated',
			text: D.isCollectionValidTitle,
			width: '17%',
			sort: true,
		},
	],
	modifications: [
		{
			dataField: 'label',
			text: D.collectionsTitle,
			width: '32%',
			isKey: true,
			sort: true,
		},
		{
			dataField: 'nbMembers',
			text: D.conceptsNumberTitle,
			width: '17%',
			sort: true,
		},
		{
			dataField: 'creator',
			text: D.creatorTitle,
			width: '17%',
			sort: true,
		},
		{
			dataField: 'modified',
			text: D.createdDateTitle,
			width: '17%',
			sort: true,
			formatter: (d) => <DateItem date={d} />,
		},
		{
			dataField: 'isValidated',
			text: D.isCollectionValidTitle,
			width: '17%',
			sort: true,
		},
	],
};
