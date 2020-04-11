import * as selectors from './auth/selectors';

import * as utils from './auth/open-id-connect-auth/token-utils';
export * from './apis/sparql-endpoint-call';
export * as API from './apis/build-api';

export const Auth = {
	...utils,
	...selectors,
};
