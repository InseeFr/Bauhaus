import { useState, useCallback } from 'react';
import ReactSelect from 'react-select';

import { ActionToolbar } from '@components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '@components/buttons/buttons-with-icons';
import { ErrorBloc } from '@components/errors-bloc';
import { TextInput } from '@components/form/input';
import LabelRequired from '@components/label-required';
import { Row } from '@components/layout';

import { GeographieApi } from '@sdk/geographie';

import D, { D1, D2 } from '../../i18n/build-dictionary';
import { useGeographies } from './hooks';
import SimsGeographyI18NLabel from './sims-geography-i18n-label';
import SimsGeographySelector from './sims-geography-selector';

const SimsGeographyField = ({ onCancel, onSave, territory = {} }) => {
	const [name, setName] = useState(territory.labelLg1 ?? '');
	const [nameLg2, setNameLg2] = useState(territory.labelLg2 ?? '');
	const [selectedOption, setSelectedOption] = useState(null);
	const [serverSideError, setServerSideError] = useState('');
	const [geographies, includes, excludes, setIncludes, setExcludes] =
		useGeographies(territory);
	const handleSelect = useCallback(
		(value) => {
			const newValue = geographies.find((g) => g.value === value);
			setSelectedOption(newValue);
		},
		[geographies],
	);
	const include = () => {
		setIncludes([...includes, selectedOption]);
		setSelectedOption(null);
	};
	const exclude = () => {
		setExcludes([...excludes, selectedOption]);
		setSelectedOption(null);
	};

	const formatOptionLabel = (geography) => {
		return <SimsGeographyI18NLabel geography={geography} />;
	};
	const onRemoveExclude = useCallback(
		(geography) => {
			setExcludes(excludes.filter((g) => g.value !== geography.value));
		},
		[excludes, setExcludes],
	);
	const onRemoveInclude = useCallback(
		(geography) => {
			setIncludes(includes.filter((g) => g.value !== geography.value));
		},
		[includes, setIncludes],
	);

	const save = useCallback(() => {
		const formatted = {
			...territory,
			labelLg1: name,
			labelLg2: nameLg2,
			unions: includes.map((i) => ({ uri: i.value })),
			difference: excludes.map((i) => ({ uri: i.value })),
		};
		const method = formatted.id
			? GeographieApi.putTerritory(formatted.id, formatted)
			: GeographieApi.postTerritory(formatted);
		method
			.then((uri) => {
				onSave(territory.uri ?? uri);
			})
			.catch((err) => setServerSideError(JSON.parse(err).message));
	}, [territory, name, nameLg2, includes, excludes, onSave]);

	return (
		<div className="w-100 container">
			<ActionToolbar>
				<CancelButton action={onCancel} col={3} />
				<SaveButton action={save} col={3} />
			</ActionToolbar>
			{serverSideError && <ErrorBloc error={serverSideError} />}
			<Row>
				<div className="form-group col-md-6">
					<LabelRequired className="form-label w-100">
						{D1.simsGeographyZoneName}
					</LabelRequired>
					<TextInput value={name} onChange={(e) => setName(e.target.value)} />
				</div>
				<div className="form-group col-md-6">
					<LabelRequired className="form-label w-100">
						{D2.simsGeographyZoneName}
					</LabelRequired>
					<TextInput
						value={nameLg2}
						onChange={(e) => setNameLg2(e.target.value)}
					/>
				</div>
			</Row>
			<div className="bauhaus-sims-geography-field">
				<div className="form-group">
					<ReactSelect
						value={
							geographies.find(
								(option) => option.value === selectedOption?.value,
							) || null
						}
						options={geographies}
						onChange={(e) => handleSelect(e ? e.value : '')}
						placeholder=""
						searchable={true}
						noResultsText={D.noResult}
						isClearable={true}
						formatOptionLabel={formatOptionLabel}
					/>
				</div>
				<div className="btn-group" role="group">
					<button
						type="button"
						className="btn btn-default"
						disabled={!selectedOption}
						onClick={include}
					>
						{D.include}
					</button>
					<button
						type="button"
						className="btn btn-default"
						disabled={!selectedOption}
						onClick={exclude}
					>
						{D.exclude}
					</button>
				</div>
			</div>
			<SimsGeographySelector
				includes={includes}
				excludes={excludes}
				onRemoveExclude={onRemoveExclude}
				onRemoveInclude={onRemoveInclude}
			/>
		</div>
	);
};

export default SimsGeographyField;
