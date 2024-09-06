import { buildApi } from './build-api';

const api = {
	getDocumentsAandLinksList: () => [''],
};

export const DocumentsApi = buildApi('documents', api) as any;
