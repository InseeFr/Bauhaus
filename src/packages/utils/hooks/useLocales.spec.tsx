import { renderHook } from '@testing-library/react';
import { useLocales } from './useLocales';
import { AppContextProvider } from '../../application/app-context';

describe('useLocales', () => {
	it('returns the correct initial value and toggle function', () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<AppContextProvider lg1="English" lg2="French" properties={{} as any}>
				{children}
			</AppContextProvider>
		);

		const { result } = renderHook(() => useLocales(), { wrapper });

		const { lg1, lg2 } = result.current;
		expect(lg1).toBe('English');
		expect(lg2).toBe('French');
	});
});
