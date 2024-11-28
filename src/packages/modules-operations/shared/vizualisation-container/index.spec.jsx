import { vi } from 'vitest';

import VisualizationContainer from './';

describe('VisualizationContainer', () => {
	describe('componentDidMount', () => {
		it('should call load if the id is not defined', () => {
			const component = new VisualizationContainer({ id: '1', object: {} });
			component.props.load = vi.fn();
			component.componentDidMount();
			expect(component.props.load).toHaveBeenCalledWith('1');
		});
		it('should not call load if the id is defined', () => {
			const component = new VisualizationContainer({
				id: '1',
				object: { id: '1' },
			});
			component.props.load = vi.fn();
			component.componentDidMount();
			expect(component.props.load).not.toHaveBeenCalled();
		});
	});
	describe('componentWillReceiveProps', () => {
		it('should call load if the id is not the same', () => {
			const component = new VisualizationContainer({
				id: '1',
				object: { id: '1' },
			});
			component.props.load = vi.fn();
			component.componentWillReceiveProps({ id: '2' });
			expect(component.props.load).toHaveBeenCalledWith('2');
		});
		it('should not call load if the id is the same', () => {
			const component = new VisualizationContainer({
				id: '1',
				object: { id: '1' },
			});
			component.props.load = vi.fn();
			component.componentWillReceiveProps({ id: '1' });
			expect(component.props.load).not.toHaveBeenCalled();
		});
	});
	describe('publish', () => {
		it('should call setstate if we have an error', () => {
			const component = new VisualizationContainer({
				id: '1',
				object: { id: '1' },
			});
			component.setState = vi.fn();
			const callback = vi
				.fn()
				.mockImplementation((_object, callback) => callback('error'));
			const object = { id: '1' };
			component.publish(object, callback);
			expect(component.setState).toHaveBeenCalledWith({
				serverSideError: 'error',
			});
		});
		it('should not call setstate if we do not have any error', () => {
			const load = vi.fn();
			const component = new VisualizationContainer({
				id: '1',
				object: { id: '1' },
				load,
			});
			component.setState = vi.fn();
			const callback = vi
				.fn()
				.mockImplementation((_object, callback) => callback(null, 'value'));
			const object = { id: '1' };
			component.publish(object, callback);
			expect(component.setState).not.toHaveBeenCalled();
			expect(load).toHaveBeenCalledWith('1');
		});
	});
});
