import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { AppContext } from 'index';
import { Input, Loading, ErrorBloc } from '@inseefr/wilco';
import Controls from './controls';
import Components from './components';
import { StructureAPI } from 'bauhaus-structures';
import D, { D1, D2 } from 'js/i18n';

const defaultDSD = {
	id: '',
	labelLg1: '',
	labelLg2: '',
	descriptionLg1: '',
	descriptionLg2: '',
	componentDefinitions: [],
};

export const validate = (DSD) => {
	const { identifiant, labelLg1, labelLg2 } = DSD;
	if (!identifiant) {
		return D.requiredId;
	} else if (!labelLg1 || !labelLg2) {
		return D.requiredLabel;
	}
};

const Edition = ({ creation, initDSD }) => {
	const [DSD, setDSD] = useState(() => defaultDSD);
	const [loading, setLoading] = useState(false);
	const [redirectId, setRedirectId] = useState('');
	const onChange = (key, value) => {
		setDSD({ ...DSD, [key]: value });
	};
	const { lg1, lg2 } = useContext(AppContext);
	const {
		identifiant,
		labelLg1,
		labelLg2,
		descriptionLg1,
		descriptionLg2,
		componentDefinitions = [],
	} = DSD;

	useEffect(() => {
		setDSD({ ...defaultDSD, ...initDSD });
	}, [initDSD]);

	if (redirectId) return <Redirect to={`/structures/${redirectId}`} />;
	if (loading) return <Loading textType={'saving'} />;

	const errorMessage = validate(DSD);

	return (
		<>
			<Controls
				creation={creation}
				save={() => {
					const structure = {
						...DSD,
						creator: 'DG75-H250',
						contributor: 'DG75-H250',
						disseminationStatus: 'http://id.insee.fr/codes/base/statutDiffusion/PublicGenerique'
					}
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
			<Components
				creation={creation}
				componentDefinitions={componentDefinitions}
				onChange={(components) => onChange('componentDefinitions', components)}
			/>
		</>
	);
};

export default Edition;
