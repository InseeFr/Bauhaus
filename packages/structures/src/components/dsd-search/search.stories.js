import React from 'react';
import { storiesOf } from '@storybook/react';
import { SearchFormList } from './search';
import { MemoryRouter } from 'react-router-dom';
const stories = storiesOf('DSD Advanced Search', module);

const styleDecorator = storyFn => (
	<div className="col-md-12" style={{ marginTop: '5%' }}>
		<MemoryRouter>{storyFn()}</MemoryRouter>
	</div>
);
stories.addDecorator(styleDecorator);

const dsds = [
	{
		id: '5e986f27fb9413edee5eea85',
		label: 'amet sunt elit',
		components: [
			{
				label: 'component1',
				concept: 'concept1',
				type: 'http://purl.org/linked-data/cube#measure',
			},
			{
				label: 'component2',
				concept: 'concept2',
				type: 'http://purl.org/linked-data/cube#dimension',
			},
		],
	},
	{
		id: '5e986f275e2c1c6c49415842',
		label: 'eiusmod esse proident',
		components: [
			{
				label: 'component1',
				concept: 'concept3',
				type: 'http://purl.org/linked-data/cube#dimension',
			},
			{
				label: 'component4',
				concept: 'concept4',
				type: 'http://purl.org/linked-data/cube#measure',
			},
		],
	},
	{
		id: '5e986f2799a1ab53f2a121e1',
		label: 'ipsum ipsum amet',
		components: [
			{
				label: 'component5',
				concept: 'concept5',
				type: 'http://purl.org/linked-data/cube#attribute',
			},
			{
				label: 'component6',
				concept: 'concept6',
				type: 'http://purl.org/linked-data/cube#measure',
			},
		],
	},
	{
		id: '5e986f27c27ba107cd980449',
		label: 'commodo elit esse',
		components: [
			{
				label: 'component7',
				concept: 'concept7',
				type: 'http://purl.org/linked-data/cube#measure',
			},
			{
				label: 'component8',
				concept: 'concept8',
				type: 'http://purl.org/linked-data/cube#measure',
			},
		],
	},
];

stories.add('Default', () => {
	return <SearchFormList data={dsds} />;
});
