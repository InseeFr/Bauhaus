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
	app?: {
		secondLang: boolean;
		lg1: string;
		lg2: string;
		auth: {
			type: string;
			user: {
				roles: string[];
				stamp: string;
			};
		};
	};
};
