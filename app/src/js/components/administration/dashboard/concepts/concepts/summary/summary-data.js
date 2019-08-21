import D from 'js/i18n';

export const rowParams = [
	{
		dataField: 'type',
		label: '',
		width: '32%',
		isKey: true,
	},
	{ dataField: 'total', label: D.totalTitle, width: '17%' },
	{ dataField: 'generic', label: D.DSPublicGeneriqueTitle, width: '17%' },
	{
		dataField: 'specific',
		label: D.DSPublicSpecifiqueTitle,
		width: '17%',
	},
	{ dataField: 'private', label: D.DSPrivateTitle, width: '17%' },
];

export const buildData = d => [
	{
		type: D.conceptsNumberTitle,
		total: d.length,
		generic: d.filter(c => c.disseminationStatus.endsWith('PublicGenerique'))
			.length,
		specific: d.filter(c => c.disseminationStatus.endsWith('PublicSpecifique'))
			.length,
		private: d.filter(c => c.disseminationStatus.endsWith('Prive')).length,
	},
	{
		type: D.topConceptsNumberTitle,
		total: d.filter(c => c.isTopConceptOf === 'true').length,
		generic: d.filter(
			c =>
				c.disseminationStatus.endsWith('PublicGenerique') &&
				c.isTopConceptOf === 'true'
		).length,
		specific: d.filter(
			c =>
				c.disseminationStatus.endsWith('PublicSpecifique') &&
				c.isTopConceptOf === 'true'
		).length,
		private: d.filter(
			c =>
				c.disseminationStatus.endsWith('Prive') && c.isTopConceptOf === 'true'
		).length,
	},
	{
		type: D.provisionalConceptsNumberTitle,
		total: d.filter(c => c.validationStatus === 'false').length,
		generic: d.filter(
			c =>
				c.disseminationStatus.endsWith('PublicGenerique') &&
				c.validationStatus === 'false'
		).length,
		specific: d.filter(
			c =>
				c.disseminationStatus.endsWith('PublicSpecifique') &&
				c.validationStatus === 'false'
		).length,
		private: d.filter(
			c =>
				c.disseminationStatus.endsWith('Prive') &&
				c.validationStatus === 'false'
		).length,
	},
	{
		type: D.validDateConceptsNumberTitle,
		total: d.filter(c => c.valid).length,
		generic: d.filter(
			c => c.disseminationStatus.endsWith('PublicGenerique') && c.valid
		).length,
		specific: d.filter(
			c => c.disseminationStatus.endsWith('PublicSpecifique') && c.valid
		).length,
		private: d.filter(c => c.disseminationStatus.endsWith('Prive') && c.valid)
			.length,
	},
];
