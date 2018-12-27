import React from 'react';
import renderer from 'react-test-renderer';
import MSDItemLayout from './';

describe('MSDItemLayout', () => {
	it('should return the right template', () => {
		const tree = renderer
			.create(<MSDItemLayout title={'title'}>CHILDREN</MSDItemLayout>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
