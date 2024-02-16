import D, { D1, D2 } from '../../../i18n/build-dictionary';
import { formatValidation } from 'js/utils/validation';
import { z } from 'zod';

const Dataset = z.object({
	labelLg1: z.string({
        required_error: D.mandatoryProperty(D1.title)
    }).min(1, {
        message: D.mandatoryProperty(D1.title)
    }),
	labelLg2: z.string({
        required_error: D.mandatoryProperty(D2.title)
    }).min(1, {
        message: D.mandatoryProperty(D2.title)
    }),
	creator: z.string({required_error: D.mandatoryProperty(D1.creatorTitle)}),
	contributor: z.string({required_error: D.mandatoryProperty(D1.contributorTitle)}),
	disseminationStatus: z.string({required_error: D.mandatoryProperty(D1.disseminationStatusTitle)}),
	idSerie: z.string({required_error: D.mandatoryProperty(D1.generatedBy)}),
});

export const validate = ({catalogRecord, ...otherFields}) => formatValidation(Dataset)({creator: catalogRecord['creator'], contributor: catalogRecord['contributor'], ...otherFields});
