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
	},
	{
		id: '5e986f275e2c1c6c49415842',
		label: 'eiusmod esse proident',
	},
	{
		id: '5e986f2799a1ab53f2a121e1',
		label: 'ipsum ipsum amet',
	},
	{
		id: '5e986f27c27ba107cd980449',
		label: 'commodo elit esse',
	},
];

stories.add('Default', () => {
	return <SearchFormList data={dsds} />;
});
