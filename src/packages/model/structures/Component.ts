import { ValidationState } from '../../components';

export type Component = {
	identifiant?: string;
	type?: string;
	validationState?: ValidationState;
	id?: string;
	labelLg1?: string;
	labelLg2?: string;
	notation?: string;
	required?: boolean;
	attachment?: string;
	codeList?: string;
	concept?: string;
};

export type ComponentDefinition = {
	id?: string;
	component: Component;
	order?: string | number;
};
