import { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { LabelRequired } from '@inseefr/wilco';
import {
	Loading,
	TextInput,
	Row,
	ContributorsInput,
	DisseminationStatusInput,
	ClientSideError,
	ErrorBloc,
	GlobalClientSideErrorBloc,
	Select,
} from '../../../new-architecture/components';

import Controls from './controls';
import Components from './components';
import StructureAPI from '../apis/structure-api';
import { DISSEMINATION_STATUS } from '../utils/constants';
import { AppContext, Auth } from '../../../utils';
import D, { D1, D2 } from '../../../i18n';
import { useSelector } from 'react-redux';
import { validate } from './validation';
import { useStampsOptions } from '../../../new-architecture/utils/hooks/stamps';

const defaultDSD = {
	identifiant: '',
	labelLg1: '',
	labelLg2: '',
	descriptionLg1: '',
	descriptionLg2: '',
	disseminationStatus: DISSEMINATION_STATUS.PUBLIC_GENERIC,
	contributor: ['DG75-H250'],
	componentDefinitions: [],
	isRequiredBy: '',
};

const Edition = ({ creation, initialStructure }) => {
	const stampListOptions = useStampsOptions();

	const { lg1, lg2 } = useContext(AppContext);

	const [structure, setStructure] = useState(defaultDSD);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const [redirectId, setRedirectId] = useState('');
	const [serverSideError, setServerSideError] = useState('');
	const [clientSideError, setClientSideError] = useState({});

	const onChange = (key, value) => {
		setStructure({ ...structure, [key]: value });
		setClientSideError({
			...clientSideError,
			errorMessage: [],
		});
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
	} = structure;

	const permission = useSelector(Auth.getPermission);
	const stamp = permission?.stamp;
	const isContributor =
		permission?.roles?.includes(Auth.STRUCTURE_CONTRIBUTOR) &&
		!permission?.roles?.includes(Auth.ADMIN);

	useEffect(() => {
		let structure = { ...defaultDSD, ...initialStructure };

		if (isContributor && creation) {
			structure.contributor = stamp;
		}
		setStructure(structure);
	}, [initialStructure, isContributor, stamp, creation]);

	if (redirectId) return <Redirect to={`/structures/${redirectId}`} />;
	if (loading) return <Loading textType={'saving'} />;

	const onSave = () => {
		const clientSideErrors = validate(structure);

		if (clientSideErrors.errorMessage?.length > 0) {
			setSubmitting(true);
			setClientSideError(clientSideErrors);
		} else {
			setLoading(true);
			(creation
				? StructureAPI.postStructure(structure)
				: StructureAPI.putStructure(structure)
			)
				.then((id) => {
					setRedirectId(id);
				})
				.catch((error) => {
					setServerSideError(error);
				})
				.finally(() => setLoading(false));
		}
	};
	return (
		<>
			<Controls
				creation={creation}
				save={onSave}
				disabledSave={clientSideError.errorMessage?.length > 0}
			/>
			{submitting && clientSideError && (
				<GlobalClientSideErrorBloc
					clientSideErrors={clientSideError.errorMessage}
					D={D}
				/>
			)}
			{serverSideError && <ErrorBloc error={serverSideError} D={D} />}
			<LabelRequired htmlFor="identifiant">{D1.idTitle}</LabelRequired>
			<TextInput
				id="identifiant"
				value={identifiant}
				onChange={(e) => onChange('identifiant', e.target.value)}
				disabled={!creation}
				aria-invalid={!!clientSideError.fields?.identifiant}
				aria-describedby={
					!!clientSideError.fields?.identifiant ? 'identifiant-error' : null
				}
			/>
			<ClientSideError
				id="identifiant-error"
				error={clientSideError?.fields?.identifiant}
			></ClientSideError>

			<Row>
				<div className="col-md-6">
					<LabelRequired htmlFor="labelLg1">{D1.labelTitle}</LabelRequired>
					<TextInput
						id="labelLg1"
						value={labelLg1}
						onChange={(e) => onChange('labelLg1', e.target.value)}
						aria-invalid={!!clientSideError.fields?.labelLg1}
						aria-describedby={
							!!clientSideError.fields?.labelLg1 ? 'labelLg1-error' : null
						}
					/>
					<ClientSideError
						id="labelLg1-error"
						error={clientSideError?.fields?.labelLg1}
					></ClientSideError>
				</div>
				<div className="col-md-6">
					<LabelRequired htmlFor="labelLg1">{D2.labelTitle}</LabelRequired>
					<TextInput
						id="labelLg2"
						value={labelLg2}
						onChange={(e) => onChange('labelLg2', e.target.value)}
						aria-invalid={!!clientSideError.fields?.labelLg2}
						aria-describedby={
							!!clientSideError.fields?.labelLg2 ? 'labelLg2-error' : null
						}
					/>
					<ClientSideError
						id="labelLg2-error"
						error={clientSideError?.fields?.labelLg2}
					></ClientSideError>
				</div>
			</Row>
			<Row>
				<div className="col-md-6">
					<label htmlFor="descriptionLg1">
						{D1.descriptionTitle} ({lg1})
					</label>
					<TextInput
						id="descriptionLg1"
						value={descriptionLg1}
						onChange={(e) => onChange('descriptionLg1', e.target.value)}
					/>
				</div>
				<div className="col-md-6">
					<label htmlFor="descriptionLg2">
						{D1.descriptionTitle} ({lg2})
					</label>
					<TextInput
						id="descriptionLg2"
						value={descriptionLg2}
						onChange={(e) => onChange('descriptionLg2', e.target.value)}
					/>
				</div>
			</Row>
			<div className="form-group">
				<label>{D1.creatorTitle}</label>
				<Select
					placeholder={D1.stampsPlaceholder}
					value={stampListOptions.find(({ value }) => value === creator)}
					options={stampListOptions}
					onChange={(value) => onChange('creator', value)}
					searchable
				/>
			</div>
			<div className="form-group">
				<ContributorsInput
					value={contributor}
					handleChange={(values) => onChange('contributor', values)}
					stampListOptions={stampListOptions}
				/>
			</div>

			<div className="form-group">
				<DisseminationStatusInput
					value={disseminationStatus}
					handleChange={(value) => onChange('disseminationStatus', value)}
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

export default Edition;
