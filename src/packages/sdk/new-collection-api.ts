
import { buildApi } from './build-api';

const api = {
    getCollectionList: () => [''],
    getCollectionById: (id: string) => [id],
};

export const CollectionApi = buildApi('concepts/collections', api) as any;
