import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, getByText, queryByText, render } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import { canBeDeleted, ComponentDetailView } from './view';
import { Provider } from 'react-redux';
import { Auth } from 'bauhaus-utilities';

const mockStore = configureStore([]);
const store = mockStore({
	users: {
		results: {
			stamp: 'stamp',
		},
	},
	app: {
		secondLang: true,
		auth: {
			user: {
				roles: [Auth.ADMIN],
			},
		},
	},
	stampList: {
		results: [],
	},
});

describe('canBeDeleted', () => {
	it('can delete if the component is unpublished', () => {
		expect(
			canBeDeleted({ validationState: 'Unpublished', structures: [] }),
		).toBeTruthy();
	});
	it('cannot delete if the component is Validated', () => {
		expect(
			canBeDeleted({ validationState: 'Validated', structures: [] }),
		).toBeFalsy();
	});

	it('cannot delete if the component is Modified', () => {
		expect(
			canBeDeleted({ validationState: 'Modified', structures: [] }),
		).toBeFalsy();
	});

	it('cannot delete if the component is linked to a structure', () => {
		expect(
			canBeDeleted({
				validationState: 'Unpublished',
				structures: [{ validationState: 'Validated' }],
			}),
		).toBeFalsy();
	});

	it('cannot delete if one structure is Modified', () => {
		expect(
			canBeDeleted({
				validationState: 'Unpublished',
				structures: [{ validationState: 'Modified' }],
			}),
		).toBeFalsy();
	});
});
describe('<ComponentDetailView />', () => {
	const component = {
		id: '5e7334002a5c764f68247222',
		identifiant: '5e7334002a5c764f68247222',
		labelLg1: 'veniam non irure',
		labelLg2: 'nisi aliquip',
		type: 'http://purl.org/linked-data/cube#DimensionProperty',
		attachment: ['http://purl.org/linked-data/cube#Observation'],
		concept: 439,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 942,
		range: 'http://rdf.insee.fr/def/base#codeList',
		structures: [],
		validationState: 'Validated',
		created: new Date('2020-01-01'),
		modified: new Date('2020-01-01'),
		contributor: 'STAMP CONTRIBUTOR',
		creator: 'STAMP CREATOR',
		disseminationStatus: 'http://id.insee.fr/codes/base/statutDiffusion/PublicGenerique',
	};

	const concepts = [
		{
			altLabel: '',
			id: component.concept.toString(),
			label: 'Concept - Label ' + component.concept,
		},
	];
	const codesLists = [
		{
			altLabel: '',
			id: component.codeList.toString(),
			label: 'Code List - Label ' + component.codeList,
		},
	];
	it('should display  the update button if the component is updatable', () => {
		const { container } = render(
			<Provider store={store}>
				<ComponentDetailView
					component={component}
					concepts={concepts}
					codesLists={codesLists}
					handleBack={() => {
					}}
					handleUpdate={() => {
					}}
					updatable={false}
				></ComponentDetailView>
			</Provider>,
		);

		expect(queryByText(container, 'Update')).not.toBeInTheDocument();
	});
	it('should call handleBack', () => {
		const handleBack = jest.fn();
		const { container } = render(
			<Provider store={store}>
				<ComponentDetailView
					component={component}
					concepts={concepts}
					codesLists={codesLists}
					handleBack={handleBack}
					handleUpdate={() => {
					}}
				></ComponentDetailView>
			</Provider>,
		);
		fireEvent.click(getByText(container, 'Back'));

		expect(handleBack).toHaveBeenCalled();
	});
	it('should call handleUpdate', () => {
		const handleUpdate = jest.fn();

		const { container } = render(
			<Provider store={store}>
				<ComponentDetailView
					component={component}
					concepts={concepts}
					codesLists={codesLists}
					handleBack={() => {
					}}
					handleUpdate={handleUpdate}
					updatable={true}
				></ComponentDetailView>
			</Provider>,
		);

		fireEvent.click(getByText(container, 'Update'));

		expect(handleUpdate).toHaveBeenCalled();
	});
	it('should display the main values', () => {
		const { container } = render(
			<Provider store={store}>
				<ComponentDetailView
					component={component}
					concepts={concepts}
					codesLists={codesLists}
					handleBack={() => {
					}}
					handleUpdate={() => {
					}}
				></ComponentDetailView>
			</Provider>,
		);

		expect(queryByText(container, 'Dimension')).toBeInTheDocument();
		expect(queryByText(container, 'Code list')).toBeInTheDocument();
	});
	it('should display the attachment if the type is an attribute', () => {
		const { container } = render(
			<Provider store={store}>
				<ComponentDetailView
					component={{
						...component,
						type: 'http://purl.org/linked-data/cube#attribute',
					}}
					concepts={concepts}
					codesLists={codesLists}
					handleBack={() => {
					}}
					handleUpdate={() => {
					}}
				></ComponentDetailView>
			</Provider>,
		);
		expect(queryByText(container, 'Observation')).toBeInTheDocument();
	});

	it('should not display the codeList if the range is  not an XSD_CODE_LIST', () => {
		const { container } = render(
			<Provider store={store}>
				<ComponentDetailView
					component={{ ...component, range: 'fake' }}
					concepts={concepts}
					codesLists={codesLists}
					handleBack={() => {
					}}
					handleUpdate={() => {
					}}
				></ComponentDetailView>
			</Provider>,
		);

		expect(queryByText(container, 'Code List - Label 492')).not.toBeInTheDocument();
	});

	it('should display the general informations block', () => {
		const { container } = render(
			<Provider store={store}>
				<ComponentDetailView
					component={{ ...component, range: 'fake' }}
					concepts={concepts}
					codesLists={codesLists}
					handleBack={() => {
					}}
					handleUpdate={() => {
					}}
				></ComponentDetailView>
			</Provider>,
		);
		expect(container.querySelector('ul li:nth-child(1)').innerHTML).toContain('Notation : 5e7334002a5c764f68247222');
		expect(container.querySelector('ul li:nth-child(2)').innerHTML).toContain('Creation date : 01/01/2020');
		expect(container.querySelector('ul li:nth-child(3)').innerHTML).toContain('Modification date : 01/01/2020');
		expect(container.querySelector('ul li:nth-child(4)').innerHTML).toContain('Publication status : Published');
		expect(container.querySelector('ul li:nth-child(5)').innerHTML).toContain('Creator : STAMP CREATOR');
		expect(container.querySelector('ul li:nth-child(6)').innerHTML).toContain('Contributor : STAMP CONTRIBUTOR');
		expect(container.querySelector('ul li:nth-child(7)').innerHTML).toContain('Diffusion status : Public generic');

	});
});
