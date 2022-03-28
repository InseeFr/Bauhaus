import React, { useCallback, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import D from '../i18n/build-dictionary';
import { Stores, Auth } from 'bauhaus-utilities';
import SlidingPanel from 'react-sliding-side-panel';
import SimsGeographyField from './sims-geography-field';

import './sims-geography-picker.scss';
import { SimsGeographyI18NLabel } from 'bauhaus-operations';


const SimsGeographyPicker = ({ onChange, value, loadGeographies }) => {
	const [territory, setTerritory] = useState();
	const geographiesOptions = useSelector(Stores.Geographies.getAllOptions);
	const [slidingModal, setSlidingModal] = useState(false);
	const openNewPanel = useCallback(() => {
		setSlidingModal(true);
	}, []);

	const openViewPanel = useCallback(() => {
		setTerritory(geographiesOptions?.find(({ value: v }) => v === value)?.geography);
		setSlidingModal(true);
	}, [geographiesOptions, value]);

	const onSave = useCallback((territoryUri) => {
		setSlidingModal(false);
		loadGeographies();
		onChange(territoryUri)
	}, [loadGeographies, onChange]);

	const onCancel = useCallback(() => {
		setTerritory(undefined);
		setSlidingModal(false);
	}, []);
	const formatOptionLabel = (geography) => {
		return <SimsGeographyI18NLabel geography={geography} />;
	};

	const shouldSeeViewButton = geographiesOptions?.find(({ value: v }) => v === value)?.typeTerritory === "Territoire Statistique";
	return (
		<>
			<div className="bauhaus-sims-geography-picker">
				<div className="form-group">
					<ReactSelect
						value={geographiesOptions.find(
							({ value: gValue }) => gValue === value
						)}
						filterOption={(option, searchValue) => {
							const search = searchValue.toLowerCase();
							const label = option.data?.label.toLowerCase();
							const typeTerritory = option.data?.typeTerritory.toLowerCase();
							return !searchValue
								|| label.indexOf(search) >= 0
								|| typeTerritory.indexOf(search) >= 0
						}}
						options={geographiesOptions}
						onChange={(e) => onChange(e ? e.value : '')}
						placeholder={''}
						isSearchable={true}
						noResultsText={D.noResult}
						isClearable={true}
						formatOptionLabel={formatOptionLabel}
					/>
				</div>

				<Auth.AuthGuard roles={[Auth.ADMIN]}>
					<button type="button" className="btn btn-default" onClick={openNewPanel}>
						{D.btnNew}
					</button>
				</Auth.AuthGuard>
				<button disabled={!shouldSeeViewButton} type="button" className="btn btn-default" onClick={openViewPanel}>
					{D.btnSee}
				</button>
			</div>
			<SlidingPanel type={'right'} isOpen={slidingModal} size={60} backdropClicked={() => setSlidingModal(false)}>
				<SimsGeographyField onCancel={onCancel} onSave={onSave} territory={territory}/>
			</SlidingPanel>
		</>
	);
};
const mapDispatchToProps = {
	loadGeographies: Stores.Geographies.loadGeographies,
};

export default connect(undefined, mapDispatchToProps)(SimsGeographyPicker)

