export type ReduxModel = {
	app: {
		auth: {
			type: string;
			user: {
				roles: string[];
				stamp: string;
			};
		};
	};
};
