import D, { D1, D2 } from 'js/i18n';
import { LINK } from '../utils';
import { formatValidation } from 'js/utils/validation';
import { z } from 'zod';

const Base = z.object({
	labelLg1: z.string().min(1, {message: D.mandatoryProperty(D1.title)}),
	labelLg2: z.string().min(1, {message: D.mandatoryProperty(D2.title)}),
	lang: z.string().min(1, {message: D.requiredLang}),
});

const Link = Base.extend({
	url: z.string({
		required_error: D.mandatoryProperty(D.titleLink)
	}).url({
		message: D.badUrl
	}).startsWith("http", {
		message:D.badUrl
	}),
});

const File = z.object({
	name: z.string().regex(/^.+\/+[a-zA-Z0-9-_.]*$/, {message: D.wrongFileName})
});

const Document = Base.extend({
	updatedDate: z.string({
		required_error: D.requiredUpdatedDate
	}),
	files: z.array(File).nonempty({
		message: D.requiredFile
	}),
});

export const validate = (document, type) => formatValidation(type === LINK ? Link : Document)(document)
