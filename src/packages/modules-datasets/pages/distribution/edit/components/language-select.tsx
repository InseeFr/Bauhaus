import { Select } from '@components/select-rmes';

import { D1 } from '../../../../../deprecated-locales';
import { isLang2 } from '../../../../../i18n';

type LanguageSelectProps = {
	value?: string;
	onChange: (value: string) => void;
	disabled?: boolean;
};

const LANGUAGE_OPTIONS = [
	{ code: 'fr', labelLg1: 'Français', labelLg2: 'French' },
	{ code: 'en', labelLg1: 'Anglais', labelLg2: 'English' },
];

export const LanguageSelect = ({
	value,
	onChange,
	disabled = false,
}: LanguageSelectProps) => {
	const langSelectOptions = LANGUAGE_OPTIONS.map((lang) => ({
		value: lang.code,
		label: isLang2() ? lang.labelLg2 : lang.labelLg1,
	}));

	return (
		<div className="col-md-12 form-group">
			<label htmlFor="language">{D1.languageTitle}</label>
			<Select
				disabled={disabled}
				value={value}
				options={langSelectOptions}
				onChange={onChange}
			/>
		</div>
	);
};
