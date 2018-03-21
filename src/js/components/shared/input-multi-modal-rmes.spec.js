import React from 'react';
import { shallow } from 'enzyme';
import InputMultiModalRmes from './input-multi-modal-rmes';

describe('inputMultiModal', () => {
	it('renders without crashing', () => {
		const onClick = () => '';
		shallow(<InputMultiModalRmes body="body" close={onClick} />);
	});
});
