export type ReduxAction = {
	type: string;
	payload?: any;
};

export type ReduxAppModel = {
	auth?: {
		type: string;
		user: {
			roles: string[];
			stamp: string;
		};
	};
};

export type ReduxModel = {
	operationsOperationCurrentStatus: string;
	operationsSimsCurrent?: any;
	geographies?: {
		status: string;
		results: any[];
	};
	app?: ReduxAppModel;
};

export type CorrespondenceReduxModel = Record<string, object>;
export type ClassificationReduxModel = {
	classificationLevelGeneral: unknown;
	classificationLevelMembers: unknown;
};
