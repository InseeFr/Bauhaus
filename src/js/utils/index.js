import * as selectors from './auth/selectors';
import * as roles from './auth/roles';
import AuthGuard from './auth/components/auth';

import * as utils from './auth/open-id-connect-auth/token-utils';
import { createContext } from 'react';
export {
	default as ConceptsAPI,
	api as ConceptsAPIRoutes,
} from './apis/concepts-api';
export { default as CodesList } from './apis/codes-list-api';
export { default as StampsApi } from './apis/stamps-api';

export * as ArrayUtils from './utils/array-utils';
export * as HTMLUtils from './utils/html-utils';
export * as DateUtils from './utils/date-utils';

export const Auth = {
	...utils,
	...selectors,
	...roles,
	AuthGuard,
};
export { default as EditorHTML } from './components/editor-html';
export {
	default as EditorMarkdown,
	toolbar as EditorMarkdownToolbar,
	DeleteButton as EditorDeleteButton,
} from './components/editor-html/editor-markdown';
export { default as AdvancedSearchList } from './components/advanced-search/home';
export * as ItemToSelectModel from './utils/item-to-select-model';
export { default as ValidationButton } from './components/validationButton';
export { default as SearchableList } from './components/searchable-list';
export {
	DateItem,
	default as CreationUpdateItems,
} from './components/creation-update-items';

export { default as CheckSecondLang } from './components/check-second-lang';

export * as Stores from './stores';
export { default as PageTitleBlock } from './components/page-title-block';
export { default as ConfirmationDelete } from './components/confirmation-delete';
export { default as Pagination } from './components/pagination';

export { useQueryParam } from './utils/hooks';

export const AppContext = createContext({});
export { useTitle, withTitle, setDocumentTitle } from './utils/useTitle';
export { default as SelectRmes } from './components/select-rmes';

export { default as useUrlQueryParameters } from './hooks/useUrlQueryParameters';
export {
	default as ErrorBloc,
	GlobalClientSideErrorBloc,
	ClientSideError,
} from './components/errors-bloc';
export { default as RequiredIcon } from './components/required-icon';
