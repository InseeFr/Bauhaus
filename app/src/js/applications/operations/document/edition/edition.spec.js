import { render } from '@testing-library/react';
import { ConfirmationModal } from './edition';
import React from 'react';
import ModalRmes from 'js/applications/shared/modal-rmes/modal-rmes';

jest.mock('js/applications/shared/modal-rmes/modal-rmes');

describe('ConfirmationModal', () => {
	it('should display a Yes and No buttons', () => {
		const document = {
			uri: 'uri',
		};

		render(<ConfirmationModal document={document} isOpen={true} />);

		expect(ModalRmes).toHaveBeenCalledWith(expect.objectContaining({
            modalButtons: [
                expect.objectContaining({ label: 'No' }),
                expect.objectContaining({ label: 'Yes' })
            ]
        }), {});
	});
});
