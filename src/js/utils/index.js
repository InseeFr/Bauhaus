import * as selectors from './../new-architecture/redux/selectors';
import * as roles from './../new-architecture/auth/roles';
import AuthGuard from './../new-architecture/auth/components/auth';

import * as utils from './../new-architecture/auth/open-id-connect-auth/token-utils';
import { createContext } from 'react';

export * as ArrayUtils from './utils/array-utils';

export const Auth = {
	...utils,
	...selectors,
	...roles,
	AuthGuard,
};

export { default as AdvancedSearchList } from './components/advanced-search/home';
export {
	DateItem,
	default as CreationUpdateItems,
} from './components/creation-update-items';

export { default as CheckSecondLang } from './components/check-second-lang';

export { default as ConfirmationDelete } from './components/confirmation-delete';

export const AppContext = createContext({});
