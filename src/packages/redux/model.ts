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
	operationsSimsCurrent?: any;
	geographies?: {
		status: string;
		results: any[];
	};
	app?: ReduxAppModel;
};
