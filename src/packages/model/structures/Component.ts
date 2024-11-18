import { ValidationState } from '@components/status';

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
	fullCodeListValue?: string;
	concept?: string;
	contributor: string[];
};

export type ComponentDefinition = {
	id?: string;
	component: Component;
	order?: string | number;
};
