import D, { D1, D2 } from '../../../i18n';
import DatePickerRmes from '../../../applications/shared/date-picker-rmes';
import InputRmes from '../../../applications/shared/input-rmes';
import InputMultiRmes from '../../../applications/shared/input-multi-rmes';
import { fields as generalFields } from '../../../utils/concepts/general';
import { RequiredIcon, ClientSideError } from '../../../utils';
import { LabelRequired } from '@inseefr/wilco';
import { DisseminationStatusInput } from '../../../utils/dissemination-status/disseminationStatus';
import { TextInput } from '../../../new-architecture/components';
import Select from './../../../utils/components/select-rmes';

const handleFieldChange = (handleChange) =>
	generalFields.reduce((handlers, fieldName) => {
		handlers[fieldName] = (value) => handleChange({ [fieldName]: value });
		return handlers;
	}, {});

function ConceptGeneralEdition({
	general,
	stampList,
	handleChange,
	langs,
	errorMessage,
}) {
	const {
		prefLabelLg1,
		prefLabelLg2,
		altLabelLg1,
		altLabelLg2,
		disseminationStatus,
		creator,
		contributor,
		additionalMaterial,
		valid,
	} = general;

	const handlers = handleFieldChange(handleChange);
	const stampListOptions = stampList.map((stamp) => ({
		label: stamp,
		value: stamp,
	}));

	return (
		<div>
			<h4 className="text-center">
				( <RequiredIcon /> : {D.requiredFields})
			</h4>
			<div className="row">
				<InputRmes
					colMd={6}
					label={D1.labelTitle}
					lang={langs.lg1}
					star
					value={prefLabelLg1}
					handleChange={handlers.prefLabelLg1}
					className="w-100"
					errorBlock={
						<ClientSideError
							id="prefLabelLg1-error"
							error={errorMessage?.fields?.prefLabelLg1}
						></ClientSideError>
					}
				/>

				<InputRmes
					colMd={6}
					label={D2.labelTitle}
					lang={langs.lg2}
					hiddenStar
					value={prefLabelLg2}
					handleChange={handlers.prefLabelLg2}
					className="w-100"
				/>
			</div>
			<InputMultiRmes
				inputLg1={altLabelLg1}
				inputLg2={altLabelLg2}
				label={'altLabelTitle'}
				handleChangeLg1={handlers.altLabelLg1}
				handleChangeLg2={handlers.altLabelLg2}
				langs={langs}
			/>
			<div className="form-group">
				<LabelRequired>{D1.creatorTitle}</LabelRequired>
				<Select
					placeholder={D.stampsPlaceholder}
					value={stampListOptions.find(({ value }) => value === creator)}
					options={stampListOptions}
					onChange={handlers.creator}
				/>
				<ClientSideError
					id="creator-error"
					error={errorMessage?.fields?.creator}
				></ClientSideError>
			</div>
			<div className="form-group">
				<label>{D1.contributorTitle}</label>
				<TextInput defaultValue={contributor} disabled />
			</div>
			<div className="form-group">
				<DisseminationStatusInput
					value={disseminationStatus}
					handleChange={handlers.disseminationStatus}
				></DisseminationStatusInput>

				<ClientSideError
					id="disseminationStatus-error"
					error={errorMessage?.fields?.disseminationStatus}
				></ClientSideError>
			</div>
			<div className="form-group">
				<label>{D1.additionalMaterialTitle}</label>
				<div className="input-group">
					<span className="input-group-addon">http://</span>

					<TextInput
						value={additionalMaterial.replace('http://', '')}
						onChange={(e) => handlers.additionalMaterial(e.target.value)}
					/>
				</div>
			</div>
			<div className="form-group">
				<label>{D1.validDateTitle}</label>
				<DatePickerRmes
					value={valid}
					onChange={handlers.valid}
					placement="top"
				/>
			</div>
		</div>
	);
}

export default ConceptGeneralEdition;
