import D from '../../../../../../i18n';

export const rowParamsStamps = [
	{
		dataField: 'stamp',
		text: D.dashboardConceptsByCreatorTitle,
		width: '32%',
		isKey: true,
		sort: true,
	},
	{
		dataField: 'total',
		text: D.totalTitle,
		width: '17%',
		sort: true,
	},
	{
		dataField: 'generic',
		text: D.DSPublicGeneriqueTitle,
		width: '17%',
		sort: true,
	},
	{
		dataField: 'specific',
		text: D.DSPublicSpecifiqueTitle,
		width: '17%',
		sort: true,
	},
	{
		dataField: 'private',
		text: D.DSPrivateTitle,
		width: '17%',
		sort: true,
	},
];

export const buildDataStamps = (d) =>
	d.reduce((_, c) => {
		/*Init array element with stamp*/
		if (!_.filter((e) => e.stamp === c.creator).length)
			_.push({
				stamp: c.creator,
				total: 0,
				generic: 0,
				specific: 0,
				private: 0,
			});
		/*Increase values*/
		_.find((e) => e.stamp === c.creator).total++;
		if (c.disseminationStatus.endsWith('PublicGenerique'))
			_.find((e) => e.stamp === c.creator).generic++;
		if (c.disseminationStatus.endsWith('PublicSpecifique'))
			_.find((e) => e.stamp === c.creator).specific++;
		if (c.disseminationStatus.endsWith('Prive'))
			_.find((e) => e.stamp === c.creator).private++;
		return _;
	}, []); // sort by stamp
