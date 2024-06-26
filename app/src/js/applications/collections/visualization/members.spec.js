import { render, screen } from '@testing-library/react';
import CollectionMembers from './members';
import { MemoryRouter } from 'react-router-dom';

describe('CollectionMembers', () => {
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

	const langs = { lg1: 'fr', lg2: 'en' };

	const renderWithContext = (component) => {
		return render(<MemoryRouter>{component}</MemoryRouter>);
	};
	it('renders without crashing', () => {
		renderWithContext(
			<CollectionMembers members={[]} secondLang={true} langs={langs} />
		);
	});

	it('should render only the lg1 list', async () => {
		renderWithContext(
			<CollectionMembers members={members} secondLang={false} langs={langs} />
		);

		const links = await screen.findAllByRole('link');
		expect(links).toHaveLength(3);

		expect(links.map((link) => link.textContent)).toEqual([
			'prefLabelLg1 1',
			'prefLabelLg2 1',
			'prefLabelLg3 1',
		]);
	});

	it('should render the lg1 and lg2 list', async () => {
		renderWithContext(
			<CollectionMembers members={members} secondLang={true} langs={langs} />
		);

		const links = await screen.findAllByRole('link');
		expect(links).toHaveLength(6);

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
