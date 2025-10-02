export const ACTION_TYPES = {
	SET_SEARCH_VALUE: 'SET_SEARCH_VALUE',
	SET_TYPE_FILTER: 'SET_TYPE_FILTER',
	SET_EDIT_MODAL_VISIBLE: 'SET_EDIT_MODAL_VISIBLE',
	SET_IMPORT_MODAL_VISIBLE: 'SET_IMPORT_MODAL_VISIBLE',
	SET_FORM_DATA: 'SET_FORM_DATA',
	SET_IMPORT_DATA: 'SET_IMPORT_DATA',
} as const;

export interface State {
	searchValue: string;
	typeFilter: string;
	isEditModalVisible: boolean;
	isImportModalVisible: boolean;
	formData: { label: string; name: string };
	importData: string;
}

export type Action =
	| { type: typeof ACTION_TYPES.SET_SEARCH_VALUE; payload: string }
	| { type: typeof ACTION_TYPES.SET_TYPE_FILTER; payload: string }
	| { type: typeof ACTION_TYPES.SET_EDIT_MODAL_VISIBLE; payload: boolean }
	| { type: typeof ACTION_TYPES.SET_IMPORT_MODAL_VISIBLE; payload: boolean }
	| {
			type: typeof ACTION_TYPES.SET_FORM_DATA;
			payload: { label: string; name: string };
	  }
	| { type: typeof ACTION_TYPES.SET_IMPORT_DATA; payload: string };

export const initialState: State = {
	searchValue: '',
	typeFilter: 'all',
	isEditModalVisible: false,
	isImportModalVisible: false,
	formData: { label: '', name: '' },
	importData: '',
};

export function viewReducer(state: State, action: Action): State {
	switch (action.type) {
		case ACTION_TYPES.SET_SEARCH_VALUE:
			return { ...state, searchValue: action.payload };
		case ACTION_TYPES.SET_TYPE_FILTER:
			return { ...state, typeFilter: action.payload };
		case ACTION_TYPES.SET_EDIT_MODAL_VISIBLE:
			return { ...state, isEditModalVisible: action.payload };
		case ACTION_TYPES.SET_IMPORT_MODAL_VISIBLE:
			return { ...state, isImportModalVisible: action.payload };
		case ACTION_TYPES.SET_FORM_DATA:
			return { ...state, formData: action.payload };
		case ACTION_TYPES.SET_IMPORT_DATA:
			return { ...state, importData: action.payload };
		default:
			return state;
	}
}

// Action creators
export const actions = {
	setSearchValue: (payload: string): Action => ({
		type: ACTION_TYPES.SET_SEARCH_VALUE,
		payload,
	}),
	setTypeFilter: (payload: string): Action => ({
		type: ACTION_TYPES.SET_TYPE_FILTER,
		payload,
	}),
	setEditModalVisible: (payload: boolean): Action => ({
		type: ACTION_TYPES.SET_EDIT_MODAL_VISIBLE,
		payload,
	}),
	setImportModalVisible: (payload: boolean): Action => ({
		type: ACTION_TYPES.SET_IMPORT_MODAL_VISIBLE,
		payload,
	}),
	setFormData: (payload: { label: string; name: string }): Action => ({
		type: ACTION_TYPES.SET_FORM_DATA,
		payload,
	}),
	setImportData: (payload: string): Action => ({
		type: ACTION_TYPES.SET_IMPORT_DATA,
		payload,
	}),
};
