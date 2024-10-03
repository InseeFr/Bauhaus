export type ReduxAction = {
	type: string;
	payload: any;
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
	operationsSeriesCurrent?: any;
	operationsIndicatorsCurrent?: any;
	operationsSimsCurrent?: any;
	users?: {
		status: string;
		results: {
			stamp: string;
		};
	};
	geographies?: {
		status: string;
		results: any[];
	};
	app?: ReduxAppModel;
};
