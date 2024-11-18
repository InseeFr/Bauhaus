import { useCallback, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import ReactSelect from 'react-select';

import { SeeButton } from '@components/buttons/see';

import Auth from '../../../auth/components/auth';
import { ADMIN } from '../../../auth/roles';
import { RightSlidingPanel } from '../../../components/sliding-panel';
import {
	getAllOptions,
	loadGeographies,
} from '../../../redux/geographies.action';
import D from '../../i18n/build-dictionary';
import SimsGeographyField from './sims-geography-field';
import SimsGeographyI18NLabel from './sims-geography-i18n-label';
import './sims-geography-picker.scss';

const accentsMap = new Map([
	['A', 'Á|À|Ã|Â|Ä'],
	['a', 'á|à|ã|â|ä'],
	['E', 'É|È|Ê|Ë'],
	['e', 'é|è|ê|ë'],
	['I', 'Í|Ì|Î|Ï'],
	['i', 'í|ì|î|ï'],
	['O', 'Ó|Ò|Ô|Õ|Ö'],
	['o', 'ó|ò|ô|õ|ö'],
	['U', 'Ú|Ù|Û|Ü'],
	['u', 'ú|ù|û|ü'],
	['C', 'Ç'],
	['c', 'ç'],
	['N', 'Ñ'],
	['n', 'ñ'],
]);

const reducer = (acc, [key]) =>
	acc.replace(new RegExp(accentsMap.get(key), 'g'), key);

export const removeAccents = (text) => [...accentsMap].reduce(reducer, text);

const SimsGeographyPicker = ({
	onChange,
	value,
	loadGeographies,
	secondLang = false,
}) => {
	const [territory, setTerritory] = useState();
	const geographiesOptions = useSelector(getAllOptions);
	const geographiesOptionsLg2 = geographiesOptions.map((g) => ({
		id: g.id,
		label: g.labelLg2 ?? '',
		value: g.value,
		typeTerritory: g.typeTerritory,
	}));
	const [slidingModal, setSlidingModal] = useState(false);
	const openNewPanel = useCallback(() => {
		setSlidingModal(true);
	}, []);

	const openViewPanel = useCallback(() => {
		setTerritory(
			geographiesOptions?.find(({ value: v }) => v === value)?.geography,
		);
		setSlidingModal(true);
	}, [geographiesOptions, value]);

	const onSave = useCallback(
		(territoryUri) => {
			setSlidingModal(false);
			loadGeographies();
			onChange(territoryUri);
		},
		[loadGeographies, onChange],
	);

	const onCancel = useCallback(() => {
		setTerritory(undefined);
		setSlidingModal(false);
	}, []);
	const formatOptionLabel = (geography) => {
		return <SimsGeographyI18NLabel geography={geography} />;
	};

	const shouldSeeViewButton =
		geographiesOptions?.find(({ value: v }) => v === value)?.typeTerritory ===
		'Territoire Statistique';
	return (
		<>
			<div className="bauhaus-sims-geography-picker">
				<div className="form-group">
					<ReactSelect
						value={
							secondLang
								? geographiesOptionsLg2.find(
										({ value: gValue }) => gValue === value,
									)
								: geographiesOptions.find(
										({ value: gValue }) => gValue === value,
									)
						}
						filterOption={(option, searchValue) => {
							const search = removeAccents(searchValue.toLowerCase());
							const label = removeAccents(option?.label.toLowerCase());
							const typeTerritory = removeAccents(
								option?.typeTerritory.toLowerCase(),
							);
							return (
								!searchValue ||
								label.indexOf(search) >= 0 ||
								typeTerritory.indexOf(search) >= 0
							);
						}}
						options={secondLang ? geographiesOptionsLg2 : geographiesOptions}
						onChange={(e) => onChange(e ? e.value : '')}
						placeholder=""
						isSearchable={true}
						noResultsText={D.noResult}
						isClearable={true}
						formatOptionLabel={formatOptionLabel}
					/>
				</div>

				<Auth roles={[ADMIN]}>
					<button
						type="button"
						className="btn btn-default"
						onClick={openNewPanel}
					>
						{D.btnNew}
					</button>
				</Auth>
				<SeeButton
					disabled={!shouldSeeViewButton}
					onClick={openViewPanel}
				></SeeButton>
			</div>
			<RightSlidingPanel
				isOpen={slidingModal}
				backdropClicked={() => setSlidingModal(false)}
			>
				<SimsGeographyField
					onCancel={onCancel}
					onSave={onSave}
					territory={territory}
				/>
			</RightSlidingPanel>
		</>
	);
};
const mapDispatchToProps = {
	loadGeographies: loadGeographies,
};

export default connect(undefined, mapDispatchToProps)(SimsGeographyPicker);
