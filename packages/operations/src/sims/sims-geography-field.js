import React, { useState, useCallback } from 'react';
import { CancelButton, SaveButton, ActionToolbar, ErrorBloc } from '@inseefr/wilco';
import ReactSelect from 'react-select';

import D, {D1, D2} from '../i18n/build-dictionary';
import {
	SimsGeographyI18NLabel,
	SimsGeographySelector,
} from 'bauhaus-operations';
import { useGeographies } from './hooks';
import { Stores, Row } from 'bauhaus-utilities';

const SimsGeographyField = ({ onCancel, onSave, territory = {}}) => {
	const [name, setName] = useState(territory.labelLg1 ?? '');
	const [nameLg2, setNameLg2] = useState(territory.labelLg2 ?? '');
	const [selectedOption, setSelectedOption] = useState(null);
	const [serverSideError, setServerSideError] = useState("");
	const [
		geographies,
		includes,
		excludes,
		setIncludes,
		setExcludes
	] = useGeographies(territory);
	const handleSelect = useCallback(
		(value) => {
			const newValue = geographies.find((g) => g.value === value);
			setSelectedOption(newValue);
		},
		[geographies]
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
		[excludes, setExcludes]
	);
	const onRemoveInclude = useCallback(
		(geography) => {
			setIncludes(includes.filter((g) => g.value !== geography.value));
		},
		[includes, setIncludes]
	);

	const save = useCallback(() => {
		const formatted = {
			...territory,
			labelLg1: name,
			labelLg2: nameLg2,
			unions: includes.map(i => ({ uri: i.value })),
			difference: excludes.map(i => ({ uri: i.value }))
		}
		const method = formatted.id ?
			Stores.Geographies.api.putTerritory(formatted.id, formatted) :
			Stores.Geographies.api.postTerritory(formatted);
			method.then((uri) => {
				onSave(territory.uri ?? uri);
			}).catch(err => setServerSideError(D.errors[JSON.parse(err).code]))
	}, [territory, name, nameLg2, includes,  excludes, onSave]);

	return (
		<div className="w-100 container">
			<ActionToolbar>
				<CancelButton action={onCancel} col={3} />
				<SaveButton action={save} col={3} />
			</ActionToolbar>
			<ErrorBloc error={serverSideError} />
			<Row>
				<div className="form-group col-md-6">
					<label className="form-label w-100">
						{D1.simsGeographyZoneName}
						<input
							value={name}
							className="form-control"
							onChange={(e) => setName(e.target.value)}
						/>
					</label>
				</div>
				<div className="form-group col-md-6">
					<label className="form-label w-100">
						{D2.simsGeographyZoneName}
						<input
							value={nameLg2}
							className="form-control"
							onChange={(e) => setNameLg2(e.target.value)}
						/>
					</label>
				</div>
			</Row>
			<div className="bauhaus-sims-geography-field">
				<div className="form-group">
					<ReactSelect
						value={
							geographies.find(
								(option) => option.value === selectedOption?.value
							) || null
						}
						options={geographies}
						onChange={(e) => handleSelect(e ? e.value : '')}
						placeholder={''}
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
//where?