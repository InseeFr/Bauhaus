// Remplacez par le chemin correct
import { vi } from 'vitest';

import { Component } from '../../model/structures/Component';
import { StructureApi } from '../structure-api';
import { saveComponent } from './saveComponent';

vi.mock('../structure-api', () => ({
	StructureApi: {
		putMutualizedComponent: vi.fn(),
		postMutualizedComponent: vi.fn(),
	},
}));

describe('saveComponent', () => {
	const mockPutMutualizedComponent =
		StructureApi.putMutualizedComponent as jest.Mock;
	const mockPostMutualizedComponent =
		StructureApi.postMutualizedComponent as jest.Mock;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should call putMutualizedComponent if component has an id', async () => {
		const mockComponent: Component = {
			id: '123',
			codeList: 'codeList',
			fullCodeListValue: '',
			// ajoutez d'autres propriétés nécessaires
		} as Component;
		mockPutMutualizedComponent.mockResolvedValue('123');

		const result = await saveComponent(mockComponent);

		expect(mockPutMutualizedComponent).toHaveBeenCalledWith(mockComponent);
		expect(mockPostMutualizedComponent).not.toHaveBeenCalled();
		expect(result).toBe('123');
		expect(mockComponent.fullCodeListValue).toBe('codeList'); // Vérifie que la valeur a été synchronisée
	});

	it('should call postMutualizedComponent if component does not have an id', async () => {
		const mockComponent: Component = {
			id: undefined,
			codeList: 'codeList',
			fullCodeListValue: '',
			// ajoutez d'autres propriétés nécessaires
		} as Component;
		mockPostMutualizedComponent.mockResolvedValue('456');

		const result = await saveComponent(mockComponent);

		expect(mockPostMutualizedComponent).toHaveBeenCalledWith(mockComponent);
		expect(mockPutMutualizedComponent).not.toHaveBeenCalled();
		expect(result).toBe('456');
		expect(mockComponent.fullCodeListValue).toBe('codeList'); // Vérifie que la valeur a été synchronisée
	});

	it('should not change fullCodeListValue if it is already set', async () => {
		const mockComponent: Component = {
			id: '123',
			codeList: 'codeList',
			fullCodeListValue: 'alreadySetValue',
			// ajoutez d'autres propriétés nécessaires
		} as Component;
		mockPutMutualizedComponent.mockResolvedValue('123');

		const result = await saveComponent(mockComponent);

		expect(mockPutMutualizedComponent).toHaveBeenCalledWith(mockComponent);
		expect(mockComponent.fullCodeListValue).toBe('alreadySetValue'); // Vérifie que la valeur n'a pas changé
		expect(result).toBe('123');
	});
});
