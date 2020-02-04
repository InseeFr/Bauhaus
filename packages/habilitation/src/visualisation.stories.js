import React from 'react';
import { storiesOf } from '@storybook/react';

import Visualisation from './visualisation';
import { MemoryRouter } from 'react-router-dom';

const stories = storiesOf('Visualisation', module);

stories.add('Default', () => (
	<MemoryRouter>
		<Visualisation
			roles={[
				{
					persons: [
						{
							id: '5e2819217a606efe20f8aa44',
							label: 'Deleon Atkins',
							stamp: '1234',
						},
						{
							id: '5e28192123962f88ad7ab1a2',
							label: 'Yang Osborne',
						},
					],
					id: '1',
					label: 'admin',
				},
				{
					persons: [
						{
							id: '5e2819217a606efe20f8aa44',
							label: 'Deleon Atkins',
							stamp: '1234',
						},
					],
					id: '2',
					label: 'user',
				},
			]}
		/>
	</MemoryRouter>
));
