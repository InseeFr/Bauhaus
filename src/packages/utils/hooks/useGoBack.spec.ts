import { renderHook, act } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mock } from 'vitest';

import { useGoBack } from './useGoBack';

vi.mock('react-router-dom', () => ({
	useNavigate: vi.fn(),
	useLocation: vi.fn(),
}));

describe('useGoBack', () => {
	let mockNavigate: Mock;
	let mockLocation: { state?: unknown };

	beforeEach(() => {
		mockNavigate = vi.fn();
		(useNavigate as Mock).mockReturnValue(mockNavigate);

		mockLocation = {};
		(useLocation as Mock).mockReturnValue(mockLocation);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should navigate with replace when shouldReplace is true', () => {
		const { result } = renderHook(() => useGoBack());

		act(() => {
			result.current('/redirect-url', true);
		});

		expect(mockNavigate).toHaveBeenCalledWith('/redirect-url', {
			replace: true,
		});
	});

	it('should navigate to redirectUrl when history length is 1', () => {
		Object.defineProperty(global.history, 'length', {
			value: 1,
			writable: true,
		});

		const { result } = renderHook(() => useGoBack());

		act(() => {
			result.current('/redirect-url');
		});

		expect(mockNavigate).toHaveBeenCalledWith('/redirect-url');
	});

	it('should navigate to redirectUrl when location.state exists', () => {
		mockLocation.state = { from: '/previous-url' };

		const { result } = renderHook(() => useGoBack());

		act(() => {
			result.current('/redirect-url');
		});

		expect(mockNavigate).toHaveBeenCalledWith('/redirect-url');
	});

	it('should navigate back (-1) when history length is greater than 1 and no location.state', () => {
		Object.defineProperty(global.history, 'length', {
			value: 2,
			writable: true,
		});

		const { result } = renderHook(() => useGoBack());

		act(() => {
			result.current('/redirect-url');
		});

		expect(mockNavigate).toHaveBeenCalledWith(-1);
	});
});
