import React from 'react';
import { storiesOf } from '@storybook/react';
import TableRmes from './';
import './table-rmes.scss';

import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';

export const rows = [
	{
		dataField: 'col1',
		label: 'Col1',
		width: '50%',
		isKey: true,
	},
	{
		dataField: 'col2',
		label: 'Col2',
		width: '50%',
	},
];

const data = Array(20)
	.fill()
	.map((a, i) => ({ col1: `data ${i + 1} - 1`, col2: `data ${i + 1} - 2` }));

const stories = storiesOf('Table-Rmes', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => <div className="col-md-12">{storyFn()}</div>;
stories.addDecorator(styleDecorator);

stories.add('Default', () => <TableRmes rowParams={rows} data={data} />);

stories.add('With all props', () => (
	<TableRmes
		rowParams={rows}
		data={data}
		context={text('Context', 'concepts')}
		search={boolean('Searchable', 'true')}
		pagination={boolean('Paginable', 'true')}
		dataAlign={text('Align', 'left')}
		csvFileName={text('Export file name', 'export')}
	/>
));
