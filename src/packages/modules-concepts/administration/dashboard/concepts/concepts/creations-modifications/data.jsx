import D from '../../../../../../deprecated-locales';
import { DateItem, getDisseminationStatus } from '../../../../../../components';
import { stringToDate } from '../../../../../../utils/date-utils';

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
			formatter: getDisseminationStatus,
		},
		{
			dataField: 'created',
			text: D.createdDateTitle,
			width: '17%',
			sort: true,
			formatter: (d) => <DateItem date={d} />,
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
			formatter: getDisseminationStatus,
		},
		{
			dataField: 'modified',
			text: D.modifiedDateTitle,
			width: '17%',
			sort: true,
			formatter: (d) => stringToDate(d),
		},
		{
			dataField: 'validationStatus',
			text: D.isConceptValidTitle,
			width: '17%',
			sort: true,
		},
	],
};
