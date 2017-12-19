export const rowParams = [
	{
		dataField: 'type',
		label: '',
		width: '32%',
		isKey: true,
	},
	{ dataField: 'total', label: 'Total', width: '17%' },
	{ dataField: 'generic', label: 'Public générique', width: '17%' },
	{
		dataField: 'specific',
		label: 'Public spécifique',
		width: '17%',
	},
	{ dataField: 'private', label: 'Privé', width: '17%' },
];

export const buildData = d => [
	{
		type: 'Nombre de concepts',
		total: d.length,
		generic: d.filter(c => c.disseminationStatus.endsWith('PublicGenerique'))
			.length,
		specific: d.filter(c => c.disseminationStatus.endsWith('PublicSpecifique'))
			.length,
		private: d.filter(c => c.disseminationStatus.endsWith('Prive')).length,
	},
	{
		type: 'dont « top concepts »',
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
		type: 'dont « provisoires »',
		total: d.filter(c => c.validationStatus === 'Provisoire').length,
		generic: d.filter(
			c =>
				c.disseminationStatus.endsWith('PublicGenerique') &&
				c.validationStatus === 'Provisoire'
		).length,
		specific: d.filter(
			c =>
				c.disseminationStatus.endsWith('PublicSpecifique') &&
				c.validationStatus === 'Provisoire'
		).length,
		private: d.filter(
			c =>
				c.disseminationStatus.endsWith('Prive') &&
				c.validationStatus === 'Provisoire'
		).length,
	},
	{
		type: 'dont « ayant une date de fin de validité »',
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
