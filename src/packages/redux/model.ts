export interface ReduxAction {
	type: string;
	payload?: any;
}

export interface ReduxAppModel {
	auth?: {
		type: string;
		user: {
			roles: string[];
			stamp: string;
		};
	};
}

export interface ReduxModel {
	operationsOperationCurrentStatus: string;
	operationsSimsCurrent?: any;
	geographies?: {
		status: string;
		results: any[];
	};
	app?: ReduxAppModel;
}

export type CorrespondenceReduxModel = Record<string, object>;
export interface ClassificationReduxModel {
	classificationLevelGeneral: unknown;
	classificationLevelMembers: unknown;
}
