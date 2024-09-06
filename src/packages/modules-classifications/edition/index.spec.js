import { fireEvent, screen } from '@testing-library/react';
import { ClassificationEdition } from './index';
import { Provider } from 'react-redux';
import configureStore from '../../redux/configure-store';
import { MemoryRouter } from 'react-router-dom';
import { renderWithAppContext } from '../../tests-utils/render';

const classification = {
	isLoading: false,
	classification: {
		general: {
			valid: '2099-12-31T00:00:00.000+01:00',
			creator: 'DG75-F230',
			prefLabelLg2: 'prefLabelLg2',
			prefLabelLg1: 'prefLabelLg1',
			lastRefreshedOn: '2021-01-01T00:00:00.000+01:00',
			id: 'pcs2020',
			altLabelLg2: 'altLabelLg2',
			disseminationStatus:
				'http:/id.insee.fr/codes/base/statutDiffusion/PublicGenerique',
			altLabelLg1: 'altLabelLg1',
			issued: '2021-01-01T00:00:00.000+01:00',
		},
		levels: [
			{
				labelLg1: 'PCS 2020 \u2013  Groupes socioprofessionnels',
				id: 'groupeSocioprofessionnel',
			},
			{
				labelLg1: 'PCS 2020 \u2013 Catégories socioprofessionnelles',
				id: 'categorieSocioprofessionnelle',
			},
			{
				labelLg1: 'PCS 2020 \u2013 Groupes de professions ',
				id: 'groupeProfession',
			},
			{ labelLg1: 'PCS 2020 \u2013 Professions', id: 'profession' },
		],
	},
};

const mockSave = jest.fn();

jest.mock('../hooks', () => ({
	useClassification: () => {
		return classification;
	},
	useUpdateClassification: () => {
		return {
			save: mockSave,
		};
	},
}));
jest.mock('@tanstack/react-query', () => ({
	useQuery: () => {
		return [];
	},
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		id: 'pcs2020',
	}),
}));

const MemoryRouterWithRoute = ({ children }) => {
	return <MemoryRouter>{children}</MemoryRouter>;
};
const renderWithContexts = (component, roles = []) => {
	const store = configureStore({
		users: { results: { stamp: 'stamp' } },
		app: { auth: { type: '', user: { roles } } },
	});

	return renderWithAppContext(
		<Provider store={store}>
			<MemoryRouterWithRoute>{component}</MemoryRouterWithRoute>
		</Provider>
	);
};

describe('ClassificationEdition', () => {
	it('should display the loader', async () => {
		classification.isLoading = true;
		const { container } = renderWithContexts(<ClassificationEdition />);
		expect(container.querySelector('svg')).not.toBeNull();
	});

	it('should not display the loader', async () => {
		classification.isLoading = false;
		const { container } = renderWithContexts(<ClassificationEdition />);
		expect(container.querySelector('svg')).toBeNull();
	});

	it('should display the prefLabelLg1', async () => {
		classification.isLoading = false;
		const { container } = renderWithContexts(<ClassificationEdition />);
		const title = container.querySelector('h2');
		expect(title.innerHTML).toContain('prefLabelLg1');
	});

	it('should contain the Cancel button', async () => {
		classification.isLoading = false;
		renderWithContexts(<ClassificationEdition />);
		await screen.findByText('Cancel');
	});

	it('should contain the Save button', async () => {
		classification.isLoading = false;
		renderWithContexts(<ClassificationEdition />);
		await screen.findByText('Save');
	});

	['prefLabelLg1', 'prefLabelLg2', 'altLabelLg1', 'altLabelLg2'].forEach(
		(id) => {
			it(`should display an input for the ${id} property`, async () => {
				classification.isLoading = false;
				const { container } = renderWithContexts(<ClassificationEdition />);
				const input = container.querySelector('#' + id);
				expect(input.value).toEqual(id);
				fireEvent.change(input, { target: { value: 'new ' + id } });
				expect(input.value).toEqual('new ' + id);
			});
		}
	);
});
