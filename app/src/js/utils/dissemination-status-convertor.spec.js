import { DSURLToLabel } from './dissemination-status-convertor';

describe('dissemination-status-convertor-utils', () => {
	describe('removeTrailingSlash', () => {
		it('should return default string', () => {
			expect(DSURLToLabel('')).toEqual('Statut de diffusion inconnu');
		});

		it('should return same string', () => {
			expect(
				DSURLToLabel('http://id.insee.fr/codes/base/statutDiffusion/Prive')
			).toEqual('Privé');
		});

		it('should return same string', () => {
			expect(
				DSURLToLabel(
					'http://id.insee.fr/codes/base/statutDiffusion/PublicGenerique'
				)
			).toEqual('Public générique');
		});

		it('should return same string', () => {
			expect(
				DSURLToLabel(
					'http://id.insee.fr/codes/base/statutDiffusion/PublicSpecifique'
				)
			).toEqual('Public spécifique');
		});
	});
});
