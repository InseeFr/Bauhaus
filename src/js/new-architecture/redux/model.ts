export type ReduxModel = {
	operationsSeriesCurrent: any;
	operationsIndicatorsCurrent: any;
	operationsSimsCurrent: any;
	app: {
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
