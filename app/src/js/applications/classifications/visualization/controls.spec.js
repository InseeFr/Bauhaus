/* eslint-disable */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Controls from './controls';
import { Auth } from 'bauhaus-utilities';

const mockStore = configureStore([]);

const renderWithContexts = (component, roles = []) => {
	const store = mockStore({
		users: { results: { stamp: 'stamp' } },
		app: { secondLang: true, auth: { type: '', user: { roles } } },
	});

	return render(
		<Provider store={store}>
			{component}
		</Provider>,
		{
			wrapper: MemoryRouter,
		}
	);
}

const classification = { id: 'pcs2020'};

describe('classification-visualization-controls', () => {
	it('should contains the Back button', async () => {
		renderWithContexts(<Controls classification={classification} publish={jest.fn()} />);
		await screen.findByText('Back');
	})

	it('should contains the Validate button if we are an ADMIN', async () => {
		renderWithContexts(<Controls classification={classification} publish={jest.fn()} />, [Auth.ADMIN]);
		await screen.findByText('Publish');
	})

	it('should not contains the Validate button if we are not an ADMIN', async () => {
		renderWithContexts(<Controls classification={classification} publish={jest.fn()} />);
		const publishButton = screen.queryByText('Publish');
		expect(publishButton).toBeNull();
	})

	it('should contains the Update link if we are an ADMIN', async () => {
		renderWithContexts(<Controls classification={classification} publish={jest.fn()} />, [Auth.ADMIN]);
		const link = await screen.findByText('Update');
		expect(link.getAttribute('href')).toEqual('/classifications/classification/pcs2020/modify')
	})

	it('should not contains the Update link if we are not an ADMIN', async () => {
		renderWithContexts(<Controls classification={classification} publish={jest.fn()} />);
		const updateLink = screen.queryByText('Update');
		expect(updateLink).toBeNull();
	})

	it('should contains the Tree button', async () => {
		renderWithContexts(<Controls classification={classification} publish={jest.fn()} />);
		await screen.findByText('View tree');
	})
});
