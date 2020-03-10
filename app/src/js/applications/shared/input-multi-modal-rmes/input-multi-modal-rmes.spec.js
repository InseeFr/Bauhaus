import React from 'react';
import { render } from '@testing-library/react';
import InputMultiModalRmes from './input-multi-modal-rmes';

describe('inputMultiModal', () => {
	it('renders without crashing', () => {
		const onClick = () => '';
		render(<InputMultiModalRmes body="body" close={onClick} />);
	});
});
