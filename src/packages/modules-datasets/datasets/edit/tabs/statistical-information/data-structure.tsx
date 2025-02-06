import { Option } from '@model/SelectOption';
import { useState } from 'react';
import ReactSelect from 'react-select';

import { ClientSideError } from '@components/errors-bloc';
import { TextInput } from '@components/form/input';

import { createDictionary, firstLang } from '@utils/dictionnary';
import { useStructures } from '@utils/hooks/structures';

import { D1 } from '../../../../../deprecated-locales';
import './data-structure.css';

const URN_MODE = 'URN_MODE';
const URL_MODE = 'URL_MODE';

const D = createDictionary(firstLang, {
	chooseUrn: {
		fr: 'Saisir une URN',
		en: 'Type a URN',
	},
	chooseUrl: {
		fr: 'Choisir une structure',
		en: 'Choose a structure',
	},
});
export const DataStructure = ({
	value,
	onChange,
	error,
}: Readonly<{
	value: string;
	onChange: (value: string) => void;
	error?: string;
}>) => {
	const { data: structures } = useStructures();

	const options: Option[] =
		structures?.map(({ iri, labelLg1 }) => ({ value: iri, label: labelLg1 })) ??
		[];

	const [mode, setMode] = useState<typeof URN_MODE | typeof URL_MODE>(
		structures?.find((s) => s.iri === value) ? URL_MODE : URN_MODE,
	);

	if (mode === URN_MODE) {
		return (
			<>
				<div className="data-structure-input  col-md-12 form-group">
					<div className="w-100">
						<label className="w-100 wilco-label-required">
							{D1.datasetsDataStructure}
							<TextInput
								aria-describedby="datastructure-error"
								value={value}
								onChange={(e) => {
									onChange(e.target.value);
								}}
							/>
						</label>
						<ClientSideError
							id="datastructure-error"
							error={error}
						></ClientSideError>
					</div>
					<button
						type="button"
						className="btn btn-default"
						onClick={() => setMode('URL_MODE')}
					>
						{D.chooseUrl}
					</button>
				</div>
			</>
		);
	}
	return (
		<div className="data-structure-input col-md-12 form-group">
			<label className="w-100 wilco-label-required">
				{D1.datasetsDataStructure}
				<ReactSelect
					value={value}
					options={options}
					onChange={(option: Option) => {
						onChange(option?.value);
					}}
				/>
			</label>
			<button
				type="button"
				className="btn btn-default"
				onClick={() => setMode('URN_MODE')}
			>
				{D.chooseUrn}
			</button>
		</div>
	);
};
