import { z } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptySelectField,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import D, { D1, D2 } from '../../../deprecated-locales';
import NewDictionary from '../../../i18n';
import { Document } from '../../../model/operations/document';
import { LINK } from '../utils';

const Base = (
	documentsAndLinksList: Document[],
	currentLabelLg1: string,
	currentLabelLg2: string,
) =>
	z.object({
		labelLg1: mandatoryAndNotEmptyTextField(D1.title).refine(
			(value) =>
				value === currentLabelLg1 ||
				!documentsAndLinksList
					.map((document: Document) => document.labelLg1)
					.includes(value),

			{ error: D.duplicatedTitle },
		),
		labelLg2: mandatoryAndNotEmptyTextField(D2.title).refine(
			(value) =>
				value === currentLabelLg2 ||
				!documentsAndLinksList
					.map((document: Document) => document.labelLg2)
					.includes(value),

			{ error: D.duplicatedTitle },
		),
		lang: mandatoryAndNotEmptySelectField(D.langTitle),
	});

const ZodLink = (
	documentsAndLinksList: Document[],
	currentLabelLg1: string,
	currentLabelLg2: string,
) =>
	Base(documentsAndLinksList, currentLabelLg1, currentLabelLg2).extend({
		url: z
			.string({
				error: (issue) =>
					issue.input === undefined &&
					NewDictionary.errors.mandatoryProperty(D.titleLink),
			})
			.url({
				error: D.badUrl,
			})
			.startsWith('http', {
				error: D.badUrl,
			})
			.trim()
			.min(1, { error: NewDictionary.errors.mandatoryProperty(D.titleLink) }),
	});

const File = z.object({
	name: z
		.string()
		.regex(/^(.+\/)?[a-zA-Z0-9-_.]+$/, { error: D.wrongFileName }),
});

const ZodDocument = (
	documentsAndLinksList: Document[],
	currentLabelLg1: string,
	currentLabelLg2: string,
) =>
	Base(documentsAndLinksList, currentLabelLg1, currentLabelLg2).extend({
		updatedDate: z
			.string({
				error: (issue) => issue.input === undefined && D.requiredUpdatedDate,
			})
			.min(1, { error: D.requiredUpdatedDate })
			.nullable()
			.refine((value) => value !== null, { error: D.requiredUpdatedDate }),
		files: z.array(File).nonempty({
			error: D.requiredFile,
		}),
	});

export const validate = (
	document: Document,
	type: string,
	documentsAndLinksList: Document[],
	currentLabelLg1: string,
	currentLabelLg2: string,
) =>
	formatValidation(
		type === LINK
			? ZodLink(documentsAndLinksList, currentLabelLg1, currentLabelLg2)
			: ZodDocument(documentsAndLinksList, currentLabelLg1, currentLabelLg2),
	)(document);
