export type ReduxModel = {
	operationsSeriesCurrent?: any;
	operationsIndicatorsCurrent?: any;
	operationsSimsCurrent?: any;
	operationsOrganisations: {
		results: any[];
	};
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
		auth: {
			type: string;
			user: {
				roles: string[];
				stamp: string;
			};
		};
	};
};
