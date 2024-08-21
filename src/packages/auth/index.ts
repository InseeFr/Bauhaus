import * as selectors from '../redux/selectors';
import * as roles from './roles';
import AuthGuard from './components/auth';

import * as utils from './open-id-connect-auth/token-utils';

export const Auth = {
	...utils,
	...selectors,
	...roles,
	AuthGuard,
};
