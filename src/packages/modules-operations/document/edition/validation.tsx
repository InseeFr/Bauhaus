import D, { D1, D2 } from '../../../deprecated-locales';
import { z } from 'zod';
import { formatValidation } from '@utils/validation';
import { Document } from '../../../model/operations/document';
import { LINK } from '../utils';

const generateMandatoryAndNotEmptyField = (property: string) => {
	return z
		.string({ required_error: D.mandatoryProperty(property) })
		.trim()
		.min(1, { message: D.mandatoryProperty(property) });
};

const Base = (
	documentsAndLinksList: Document[],
	currentLabelLg1: string,
	currentLabelLg2: string,
) =>
	z.object({
		labelLg1: generateMandatoryAndNotEmptyField(D1.title).refine(
			(value) =>
				value === currentLabelLg1 ||
				!documentsAndLinksList
					.map((document: Document) => document.labelLg1)
					.includes(value),

			{ message: D.duplicatedTitle },
		),
		labelLg2: generateMandatoryAndNotEmptyField(D2.title).refine(
			(value) =>
				value === currentLabelLg2 ||
				!documentsAndLinksList
					.map((document: Document) => document.labelLg2)
					.includes(value),

			{ message: D.duplicatedTitle },
		),
		lang: z
			.string({ required_error: D.requiredLang })
			.min(1, { message: D.requiredLang }),
	});

const LinkZod = (
	documentsAndLinksList: Document[],
	currentLabelLg1: string,
	currentLabelLg2: string,
) =>
	Base(documentsAndLinksList, currentLabelLg1, currentLabelLg2).extend({
		url: z
			.string({
				required_error: D.mandatoryProperty(D.titleLink),
			})
			.url({
				message: D.badUrl,
			})
			.startsWith('http', {
				message: D.badUrl,
			})
			.trim()
			.min(1, { message: D.mandatoryProperty(D.titleLink) }),
	});

const File = z.object({
	name: z
		.string()
		.regex(/^(.+\/)?[a-zA-Z0-9-_.]+$/, { message: D.wrongFileName }),
});

const DocumentZod = (
	documentsAndLinksList: Document[],
	currentLabelLg1: string,
	currentLabelLg2: string,
) =>
	Base(documentsAndLinksList, currentLabelLg1, currentLabelLg2).extend({
		updatedDate: z
			.string({
				required_error: D.requiredUpdatedDate,
			})
			.min(1, { message: D.requiredUpdatedDate })
			.nullable()
			.refine((value) => value !== null, { message: D.requiredUpdatedDate }),
		files: z.array(File).nonempty({
			message: D.requiredFile,
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
			? LinkZod(documentsAndLinksList, currentLabelLg1, currentLabelLg2)
			: DocumentZod(documentsAndLinksList, currentLabelLg1, currentLabelLg2),
	)(document);
