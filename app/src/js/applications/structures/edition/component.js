import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { AppContext } from 'index';
import { Input, Loading, ErrorBloc, Select } from '@inseefr/wilco';
import Controls from './controls';
import Components from './components';
import { StructureAPI } from 'bauhaus-structures';
import { Stores } from 'bauhaus-utilities'
import D, { D1, D2 } from 'js/i18n';
import { useSelector, connect } from 'react-redux';
import { default as ReactSelect } from 'react-select';
import 'react-select/dist/react-select.css';

const defaultDSD = {
	id: '',
	labelLg1: '',
	labelLg2: '',
	descriptionLg1: '',
	descriptionLg2: '',
	componentDefinitions: [],
};

export const validate = (structure) => {
	const { identifiant, labelLg1, labelLg2 } = structure;
	if (!identifiant) {
		return D.requiredId;
	} else if (!labelLg1 || !labelLg2) {
		return D.requiredLabel;
	}
};


const Edition = ({ creation, initialStructure, loadDisseminationStatusList }) => {
	const stampListOptions = useSelector(state => Stores.Stamps.getStampListOptions(state));
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
		contributor = 'DG75-H250',
		disseminationStatus
	} = structure;

	useEffect(() => {
		setStructure({ ...defaultDSD, ...initialStructure });
	}, [initialStructure]);

	if (redirectId) return <Redirect to={`/structures/${redirectId}`} />;
	if (loading) return <Loading textType={'saving'} />;

	const errorMessage = validate(structure);

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
					});
				}}
				disabledSave={errorMessage}
			/>
			<ErrorBloc error={errorMessage} />
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
								{D1.labelTitle} <span className="boldRed">*</span>
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
								{D2.labelTitle} <span className="boldRed">*</span>
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
						label={D1.descriptionTitle}
						value={descriptionLg1}
						onChange={(e) => onChange('descriptionLg1', e.target.value)}
						lang={lg1}
					/>
				</div>
				<div className="col-md-6">

					<Input
						id="descriptionLg2"
						label={D1.descriptionTitle}
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
					value={stampListOptions.find(value => value === creator)}
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
					placeholder={D1.disseminationStatusPlaceholder}
					value={disseminationStatusListOptions.find(({ value }) => value === disseminationStatus)}
					options={disseminationStatusListOptions}
					onChange={(value) => onChange('disseminationStatus', value)}
					searchable={true}
				/>
			</div>
			<Components
				creation={creation}
				componentDefinitions={componentDefinitions}
				onChange={(components) => onChange('componentDefinitions', components)}
			/>
		</>
	);
};

export default connect(undefined, {
	loadDisseminationStatusList: Stores.DisseminationStatus.loadDisseminationStatusList
})(Edition);
