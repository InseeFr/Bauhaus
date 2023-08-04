import React from 'react';
import PropTypes from 'prop-types';
import D, { D1, D2 } from 'js/i18n';
import DatePickerRmes from 'js/applications/shared/date-picker-rmes';
import InputRmes from 'js/applications/shared/input-rmes';
import InputMultiRmes from 'js/applications/shared/input-multi-rmes';
import {
	propTypes as generalPropTypes,
	fields as generalFields,
} from 'js/utils/concepts/general';
import { Select, LabelRequired } from '@inseefr/wilco';
import { RequiredIcon, ClientSideError } from 'bauhaus-utilities';

const handleFieldChange = handleChange =>
	generalFields.reduce((handlers, fieldName) => {
		handlers[fieldName] = value => handleChange({ [fieldName]: value });
		return handlers;
	}, {});

function ConceptGeneralEdition({
	general,
	stampList,
	disseminationStatusList,
	handleChange,
	langs,
	errorMessage
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
	const stampListOptions = stampList.map(stamp => ({
		label: stamp,
		value: stamp,
	}));
	const disseminationStatusListOptions = disseminationStatusList.map(
		({ url: value, label }) => ({
			label,
			value,
		})
	);
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
					errorBlock={<ClientSideError id="prefLabelLg1-error" error={errorMessage?.fields?.prefLabelLg1}></ClientSideError>}
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
					className="form-control"
					placeholder={D.stampsPlaceholder}
					value={stampListOptions.find(({ value }) => value === creator)}
					options={stampListOptions}
					onChange={handlers.creator}
				/>
				<ClientSideError id="creator-error" error={errorMessage?.fields?.creator}></ClientSideError>

			</div>
			<div className="form-group">
				<label>{D1.contributorTitle}</label>
				<input
					type="text"
					className="form-control"
					defaultValue={contributor}
					disabled
				/>
			</div>
			<div className="form-group">
				<LabelRequired>{D1.disseminationStatusTitle}</LabelRequired>

				<Select
					className="form-control"
					placeholder={D.disseminationStatusPlaceholder}
					value={disseminationStatusListOptions.find(
						({ value }) => value === disseminationStatus
					)}
					options={disseminationStatusListOptions}
					onChange={handlers.disseminationStatus}
					searchable={true}
				/>
				<ClientSideError id="disseminationStatus-error" error={errorMessage?.fields?.disseminationStatus}></ClientSideError>

			</div>
			<div className="form-group">
				<label>{D1.additionalMaterialTitle}</label>
				<div className="input-group">
					<span className="input-group-addon">http://</span>

					<input
						type="text"
						className="form-control"
						value={additionalMaterial.replace('http://', '')}
						onChange={e => handlers.additionalMaterial(e.target.value)}
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

ConceptGeneralEdition.propTypes = {
	general: generalPropTypes.isRequired,
	handleChange: PropTypes.func.isRequired,
	stampList: PropTypes.array.isRequired,
	disseminationStatusList: PropTypes.array.isRequired,
	langs: PropTypes.object.isRequired,
};

export default ConceptGeneralEdition;
