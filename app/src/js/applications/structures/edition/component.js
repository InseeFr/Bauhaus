import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Input, Loading, Select } from '@inseefr/wilco';
import Controls from './controls';
import Components from './components';
import { StructureAPI, StructureConstants } from 'bauhaus-structures';
import { Stores, AppContext, ErrorBloc } from 'bauhaus-utilities'
import D, { D1, D2 } from 'js/i18n';
import { useSelector, connect } from 'react-redux';
import { default as ReactSelect } from 'react-select';
import 'react-select/dist/react-select.css';

const isRequiredBys = [
	'Melodi-Chargement',
	'Melodi-Diffusion',
	'Melodi-Diffusion-SDMX'
];

const defaultDSD = {
	id: '',
	labelLg1: '',
	labelLg2: '',
	descriptionLg1: '',
	descriptionLg2: '',
	disseminationStatus: StructureConstants.DISSEMINATION_STATUS.PUBLIC_GENERIC,
	contributor: 'DG75-H250',
	componentDefinitions: [],
	isRequiredBy: '',
};

export const validate = ({ identifiant, labelLg1, labelLg2 }) => {
	const errors = [];
	if (!identifiant) {
		errors.push(D.mandatoryProperty(D.idTitle));
	}
	if (!labelLg1) {
		errors.push(D.mandatoryProperty(D1.labelTitle));
	}
	if (!labelLg2) {
		errors.push(D.mandatoryProperty(D2.labelTitle));
	}
	return errors;
};


const Edition = ({ creation, initialStructure, loadDisseminationStatusList }) => {
	const stampListOptions = useSelector(state => Stores.Stamps.getStampListOptions(state));
	const isRequiredBysOptions = isRequiredBys.map(value => ({ label: value, value}));
	const disseminationStatusListOptions = useSelector(state => Stores.DisseminationStatus.getDisseminationStatusListOptions(state));
	useEffect(() => {
		if(disseminationStatusListOptions.length === 0){
			loadDisseminationStatusList();
		}
	}, [disseminationStatusListOptions.length, loadDisseminationStatusList]);

	const { lg1, lg2 } = useContext(AppContext);

	const [structure, setStructure] = useState(() => defaultDSD);
	const [loading, setLoading] = useState(false);
	const [redirectId, setRedirectId] = useState('');
	const [serverSideError, setServerSideError] = useState('');

	const onChange = (key, value) => {
		setStructure({ ...structure, [key]: value });
	};
	const {
		identifiant,
		labelLg1,
		labelLg2,
		descriptionLg1,
		descriptionLg2,
		componentDefinitions = [],
		creator,
		contributor,
		disseminationStatus,
		isRequiredBy
	} = structure;

	useEffect(() => {
		setStructure({ ...defaultDSD, ...initialStructure });
	}, [initialStructure]);

	if (redirectId) return <Redirect to={`/structures/${redirectId}`} />;
	if (loading) return <Loading textType={'saving'} />;

	const clientSideErrors = validate(structure);

	return (
		<>
			<Controls
				creation={creation}
				save={() => {
					setLoading(true);
					(creation
						? StructureAPI.postStructure(structure)
						: StructureAPI.putStructure(structure)
					).then((id) => {
						setRedirectId(id);
					}).catch(error => {
						setServerSideError(error)
					}).finally(() => setLoading(false))
				}}
				disabledSave={clientSideErrors.length > 0}
			/>
			{ clientSideErrors && <ErrorBloc error={clientSideErrors} D={D}/>}
			{ serverSideError && <ErrorBloc error={serverSideError} D={D}/>}
			<Input
				id="id"
				label={
					<>
						{D1.idTitle} <span className="boldRed">*</span>
					</>
				}
				value={identifiant}
				onChange={(e) => onChange('identifiant', e.target.value)}
				disabled={!creation}
			/>
			<div className="row">
				<div className="col-md-6">
					<Input
						id="labelLg1"
						label={
							<>
								{D1.labelTitle} ({lg1})<span className="boldRed">*</span>
							</>
						}
						value={labelLg1}
						onChange={(e) => onChange('labelLg1', e.target.value)}
						lang={lg1}
					/>
				</div>
				<div className="col-md-6">
					<Input
						id="labelLg2"
						label={
							<>
								{D2.labelTitle} ({lg2})<span className="boldRed">*</span>
							</>
						}
						value={labelLg2}
						onChange={(e) => onChange('labelLg2', e.target.value)}
						lang={lg2}
					/>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6">
					<Input
						id="descriptionLg1"
						label={`${D1.descriptionTitle} (${lg1})`}
						value={descriptionLg1}
						onChange={(e) => onChange('descriptionLg1', e.target.value)}
						lang={lg1}
					/>
				</div>
				<div className="col-md-6">

					<Input
						id="descriptionLg2"
						label={`${D1.descriptionTitle} (${lg2})`}
						value={descriptionLg2}
						onChange={(e) => onChange('descriptionLg2', e.target.value)}
						lang={lg2}
					/>
				</div>
			</div>
			<div className="form-group">
				<label>
					{D1.creatorTitle}
				</label>
				<Select
					className="form-control"
					placeholder={D1.stampsPlaceholder}
					value={stampListOptions.find(({ value }) => value === creator)}
					options={stampListOptions}
					onChange={(value) => onChange('creator', value)}
					searchable={true}
				/>
			</div>
			<div className="form-group">
				<label>{D1.contributorTitle}</label>
				<ReactSelect
					placeholder={D1.stampsPlaceholder}
					value={stampListOptions.find(({ value }) => value === contributor)}
					options={stampListOptions}
					onChange={(value) => onChange('contributor', value)}
					disabled={true}
				/>
			</div>

			<div className="form-group">
				<label>{D1.disseminationStatusTitle}</label>
				<Select
					className="form-control"
					placeholder={D1.disseminationStatusTitle}
					value={disseminationStatusListOptions.find(({ value }) => value === disseminationStatus)}
					options={disseminationStatusListOptions}
					onChange={(value) => onChange('disseminationStatus', value)}
					searchable={true}
				/>
			</div>
			<div className="form-group">
				<label>{D1.processusTitle}</label>
				<Select
					className="form-control"
					placeholder={D1.processusTitle}
					value={isRequiredBysOptions.find(({ value }) => value === isRequiredBy)}
					options={isRequiredBysOptions}
					onChange={(value) => onChange('isRequiredBy', value)}
					searchable={true}
				/>
			</div>
			<Components
				creation={creation}
				componentDefinitions={componentDefinitions}
				onChange={(components) => onChange('componentDefinitions', components)}
				structure={structure}
			/>
		</>
	);
};

export default connect(undefined, {
	loadDisseminationStatusList: Stores.DisseminationStatus.loadDisseminationStatusList
})(Edition);
