import D, { D1, D2 } from '../i18n/build-dictionary';
import MainDictionary from './../../deprecated-locales/build-dictionary';
import {
	validateCode,
	validateCodelist,
	validatePartialCodelist,
} from './index';

describe('validateCodelist', () => {
	it('should return errors for missing mandatory fields', () => {
		const codelist = {};

		const result = validateCodelist(codelist);

		expect(result.errorMessage).toContain(
			D.mandatoryProperty(D.lastListUriSegmentTitleShort),
		);
		expect(result.errorMessage).toContain(
			D.mandatoryProperty(D.lastCodeUriSegmentTitleShort),
		);
		expect(result.errorMessage).toContain(
			D.mandatoryProperty(D.lastClassUriSegmentTitleShort),
		);
		expect(result.errorMessage).toContain(D.mandatoryProperty(D.idTitle));
		expect(result.errorMessage).toContain(D.mandatoryProperty(D1.labelTitle));
		expect(result.errorMessage).toContain(D.mandatoryProperty(D2.labelTitle));
		expect(result.errorMessage).toContain(D.mandatoryProperty(D2.creator));
		expect(result.errorMessage).toContain(
			D.mandatoryProperty(MainDictionary.disseminationStatusTitle),
		);

		expect(result.fields.lastListUriSegment).toBe(
			D.mandatoryProperty(D.lastListUriSegmentTitleShort),
		);
		expect(result.fields.lastCodeUriSegment).toBe(
			D.mandatoryProperty(D.lastCodeUriSegmentTitleShort),
		);
		expect(result.fields.lastClassUriSegment).toBe(
			D.mandatoryProperty(D.lastClassUriSegmentTitleShort),
		);
		expect(result.fields.id).toBe(D.mandatoryProperty(D.idTitle));
		expect(result.fields.labelLg1).toBe(D.mandatoryProperty(D1.labelTitle));
		expect(result.fields.labelLg2).toBe(D.mandatoryProperty(D2.labelTitle));
		expect(result.fields.creator).toBe(D.mandatoryProperty(D.creator));
		expect(result.fields.disseminationStatus).toBe(
			D.mandatoryProperty(MainDictionary.disseminationStatusTitle),
		);
	});

	it('should pass validation for valid codelist', () => {
		const codelist = {
			lastListUriSegment: 'segment1',
			lastCodeUriSegment: 'segment2',
			lastClassUriSegment: 'segment3',
			id: 'valid_id_123',
			labelLg1: 'labelLg1',
			labelLg2: 'labelLg2',
			creator: 'creator',
			disseminationStatus: 'status',
		};

		const result = validateCodelist(codelist);

		expect(result.errorMessage).toHaveLength(0);
		expect(result.fields).toEqual({
			creator: '',
			disseminationStatus: '',
			id: '',
			labelLg1: '',
			labelLg2: '',
			lastClassUriSegment: '',
			lastCodeUriSegment: '',
			lastListUriSegment: '',
		});
	});
});

describe('validatePartialCodelist', () => {
	it('should return errors for missing mandatory fields', () => {
		const codelist = {};

		const result = validatePartialCodelist(codelist);

		expect(result.errorMessage).toContain(D.mandatoryProperty(D.idTitle));
		expect(result.errorMessage).toContain(
			D.mandatoryProperty(D.parentCodelist),
		);
		expect(result.errorMessage).toContain(D.mandatoryProperty(D1.labelTitle));
		expect(result.errorMessage).toContain(D.mandatoryProperty(D2.labelTitle));
		expect(result.errorMessage).toContain(D.mandatoryProperty(D.creator));
		expect(result.errorMessage).toContain(
			D.mandatoryProperty(MainDictionary.disseminationStatusTitle),
		);

		expect(result.fields.id).toBe(D.mandatoryProperty(D.idTitle));
		expect(result.fields.parentCode).toBe(
			D.mandatoryProperty(D.parentCodelist),
		);
		expect(result.fields.labelLg1).toBe(D.mandatoryProperty(D1.labelTitle));
		expect(result.fields.labelLg2).toBe(D.mandatoryProperty(D2.labelTitle));
		expect(result.fields.creator).toBe(D.mandatoryProperty(D.creator));
		expect(result.fields.disseminationStatus).toBe(
			D.mandatoryProperty(MainDictionary.disseminationStatusTitle),
		);
	});

	it('should return error for invalid id characters', () => {
		const codelist = {
			id: 'invalid id!',
			parentCode: 'parentCode',
			labelLg1: 'labelLg1',
			labelLg2: 'labelLg2',
			creator: 'creator',
			disseminationStatus: 'status',
		};

		const result = validatePartialCodelist(codelist);

		expect(result.errorMessage).toContain(
			D.validCharactersProperty(D1.idTitle),
		);
		expect(result.fields.id).toBe(D.validCharactersProperty(D1.idTitle));
	});

	it('should pass validation for valid codelist', () => {
		const codelist = {
			id: 'valid_id_123',
			parentCode: 'parentCode',
			labelLg1: 'labelLg1',
			labelLg2: 'labelLg2',
			creator: 'creator',
			disseminationStatus: 'status',
		};

		const result = validatePartialCodelist(codelist);

		expect(result.errorMessage).toHaveLength(0);
		expect(result.fields).toEqual({
			creator: '',
			disseminationStatus: '',
			id: '',
			labelLg1: '',
			labelLg2: '',
			parentCode: '',
		});
	});
});

describe('validateCode', () => {
	it('should return errors for missing mandatory fields', () => {
		const code = {};
		const codes = [];
		const updateMode = false;

		const result = validateCode(code, codes, updateMode);

		expect(result.errorMessage).toContain(D.mandatoryProperty(D.idTitle));
		expect(result.errorMessage).toContain(D.mandatoryProperty(D1.labelTitle));
		expect(result.errorMessage).toContain(D.mandatoryProperty(D2.labelTitle));

		expect(result.fields.code).toBe(D.mandatoryProperty(D.idTitle));
		expect(result.fields.labelLg1).toBe(D.mandatoryProperty(D1.labelTitle));
		expect(result.fields.labelLg2).toBe(D.mandatoryProperty(D2.labelTitle));
	});

	it('should return error for duplicate code when not in update mode', () => {
		const code = {
			code: 'duplicateCode',
			labelLg1: 'labelLg1',
			labelLg2: 'labelLg2',
		};
		const codes = [{ code: 'duplicateCode' }];
		const updateMode = false;

		const result = validateCode(code, codes, updateMode);

		expect(result.errorMessage).toContain(D.ErrorDoubleCode);
		expect(result.fields.code).toBe(D.ErrorDoubleCode);
	});

	it('should pass validation for valid code and no duplicate', () => {
		const code = {
			code: 'uniqueCode',
			labelLg1: 'labelLg1',
			labelLg2: 'labelLg2',
		};
		const codes = [{ code: 'anotherCode' }];
		const updateMode = false;

		const result = validateCode(code, codes, updateMode);

		expect(result.errorMessage).toHaveLength(0);
		expect(result.fields).toEqual({
			code: '',
			labelLg1: '',
			labelLg2: '',
		});
	});

	it('should pass validation for valid code in update mode', () => {
		const code = {
			code: 'duplicateCode',
			labelLg1: 'labelLg1',
			labelLg2: 'labelLg2',
		};
		const codes = [{ code: 'duplicateCode' }];
		const updateMode = true;

		const result = validateCode(code, codes, updateMode);

		expect(result.errorMessage).toHaveLength(0);
		expect(result.fields).toEqual({
			code: '',
			labelLg1: '',
			labelLg2: '',
		});
	});
});
