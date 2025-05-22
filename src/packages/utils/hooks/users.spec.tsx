import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UsersApi } from '@sdk/users-api';

import { usePrivileges } from './users';

const queryClient = new QueryClient();

const wrapper = ({ children }: any) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockPrivileges = [
	{
		application: 'APP1',
		privileges: [{ privilege: 'READ', strategy: 'ALL' }],
	},
];

vi.mock('@sdk/users-api', async () => {
	const actual =
		await vi.importActual<typeof import('@sdk/users-api')>('@sdk/users-api');
	return {
		...actual,
		UsersApi: {
			getInfo: vi.fn(),
		},
	};
});

describe('usePrivileges', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns privileges from UsersApi.getInfo()', async () => {
		(UsersApi.getInfo as any).mockResolvedValue(mockPrivileges);

		const { result } = renderHook(() => usePrivileges(), {
			wrapper,
		});

		await waitFor(() => expect(UsersApi.getInfo).toHaveBeenCalled());

		expect(result.current.privileges).toEqual(mockPrivileges);
	});
});
