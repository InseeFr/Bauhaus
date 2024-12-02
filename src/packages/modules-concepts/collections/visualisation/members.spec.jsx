import { screen } from '@testing-library/react';

import { renderWithRouter } from '../../../tests-utils/render';
import CollectionMembers from './members';

const members = [
	{
		id: '2',
		prefLabelLg1: 'prefLabelLg2 1',
		prefLabelLg2: 'prefLabelLg1 2',
	},
	{
		id: '1',
		prefLabelLg1: 'prefLabelLg1 1',
		prefLabelLg2: 'prefLabelLg2 2',
	},
	{
		id: '3',
		prefLabelLg1: 'prefLabelLg3 1',
		prefLabelLg2: 'prefLabelLg3 2',
	},
];

describe('CollectionMembers', () => {
	it('renders without crashing', () => {
		renderWithRouter(<CollectionMembers members={[]} secondLang={true} />);
	});

	it('should render only the lg1 list', async () => {
		renderWithRouter(
			<CollectionMembers members={members} secondLang={false} />,
		);

		const links = await screen.findAllByRole('link');
		expect(links).toHaveLength(3);

		screen.getByText('Concepts membres de la collection (3)');

		expect(links.map((link) => link.textContent)).toEqual([
			'prefLabelLg1 1',
			'prefLabelLg2 1',
			'prefLabelLg3 1',
		]);
	});

	it('should render the lg1 and lg2 list', async () => {
		renderWithRouter(<CollectionMembers members={members} secondLang={true} />);

		const links = await screen.findAllByRole('link');
		expect(links).toHaveLength(6);

		screen.getByText('Concepts membres de la collection (3)');
		screen.getByText('Collection concept members (3)');

		expect(links.map((link) => link.textContent)).toEqual([
			'prefLabelLg1 1',
			'prefLabelLg2 1',
			'prefLabelLg3 1',
			'prefLabelLg2 2',
			'prefLabelLg1 2',
			'prefLabelLg3 2',
		]);
	});
});
