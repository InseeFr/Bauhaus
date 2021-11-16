import React, { useState, useCallback } from 'react';
import { CancelButton, SaveButton, ActionToolbar } from '@inseefr/wilco';
import ReactSelect from 'react-select';

import D from '../i18n/build-dictionary';
import {
	SimsGeographyI18NLabel,
	SimsGeographySelector,
} from 'bauhaus-operations';
import { useGeographies } from './hooks';

const SimsGeographyField = ({ onCancel, onSave, territory = {}}) => {
	const [name, setName] = useState(territory.labelLg1 ?? '');
	const [selectedOption, setSelectedOption] = useState(null);
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

	return (
		<div className="w-100 container">
			<ActionToolbar>
				<CancelButton action={onCancel} col={3} />
				<SaveButton action={() => {
					const formatted = {
						...territory,
						labelLg1: name,
						unions: includes.map(i => ({ uri: i.value })),
						difference: excludes.map(i => ({ uri: i.value }))
					}
					onSave(formatted)
				}} col={3} />
			</ActionToolbar>
			<div className="row">
				<div className={`form-group col-md-12`}>
					<label className={`form-label w-100`}>
						{D.simsGeographyZoneName}
						<input
							value={name}
							className="form-control"
							onChange={(e) => setName(e.target.value)}
						/>
					</label>
				</div>
			</div>
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
