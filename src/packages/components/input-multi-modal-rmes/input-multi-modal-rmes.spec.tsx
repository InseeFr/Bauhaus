import { render } from '@testing-library/react';

import { InputMultiModal } from './input-multi-modal-rmes';

describe('inputMultiModal', () => {
	it('renders without crashing', () => {
		const onClick = () => '';
		render(<InputMultiModal body="body" close={onClick} />);
	});
});
