import D from 'js/i18n';

export const rowParamsStamps = [
	{
		dataField: 'stamp',
		text: D.dashboardCollectionsByCreatorTitle,
		width: '66%',
		isKey: true,
		sort: true,
	},
	{
		dataField: 'total',
		text: D.totalTitle,
		width: '34%',
		sort: true,
	},
];

export const buildDataStamps = d =>
	d.reduce((_, c) => {
		/*Init array element with stamp*/
		if (!_.filter(e => e.stamp === c.creator).length)
			_.push({
				stamp: c.creator,
				total: 0,
				generic: 0,
				specific: 0,
				private: 0,
			});
		/*Increase values*/
		_.find(e => e.stamp === c.creator).total++;
		return _;
	}, []); // sort by stamp
