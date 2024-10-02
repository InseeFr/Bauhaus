import { render } from '@testing-library/react';
import { Organizations, Organization } from './creators';
import { Organization as OrganizationType } from '../../model/organization';

const organizations: OrganizationType[] = [
	{
		iri: 'creator1',
		label: 'Organization 1',
		id: '1',
		labelLg2: 'Organization 1 Lg2',
	},
	{
		iri: 'creator2',
		label: 'Organization 2',
		id: '2',
		labelLg2: 'Organization 2 Lg2',
	},
];

describe('Organizations component', () => {
	it('renders a list of organizations', () => {
		const creators = ['creator1', 'creator2'];

		const { getByText } = render(
			<Organizations creators={creators} organizations={organizations} />,
		);

		getByText('Organization 1');
		getByText('Organization 2');
	});

	it('renders nothing when creators list is empty', () => {
		const { container } = render(
			<Organizations creators={[]} organizations={organizations} />,
		);

		expect(container.querySelector('li')).toBeNull();
	});
});

describe('Organization component', () => {
	it('renders the label of the organization', () => {
		const creator = 'creator1';
		const { getByText } = render(
			<Organization creator={creator} organizations={organizations} />,
		);

		getByText('Organization 1');
	});
});
