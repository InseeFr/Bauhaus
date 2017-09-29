import React from 'react';
import PropTypes from 'prop-types';
import { dictionary } from 'js/utils/dictionary';
import DatePickerRmes from 'js/components/shared/date-picker-rmes';
import SelectRmes from 'js/components/shared/select-rmes';
import InputRmes from 'js/components/shared/input-rmes';
import InputMultiRmes from 'js/components/shared/input-multi-rmes';
import flagFr from 'js/components/shared/flag-fr';
import flagEn from 'js/components/shared/flag-en';
import {
	propTypes as generalPropTypes,
	fields as generalFields,
} from 'js/utils/concepts/general';

//TODO make an utility function (see `notes-edition.js` for another usage)
const handleFieldChange = handleChange =>
	//TODO rewrite fields (required should be handled elsewhere)
	generalFields.reduce((handlers, fieldName) => {
		handlers[fieldName] = value => handleChange({ [fieldName]: value });
		return handlers;
	}, {});

function ConceptGeneralEdition({
	general,
	stampList,
	disseminationStatusList,
	handleChange,
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

	return (
		<div>
			<h4 className="centered">
				( <span className="boldRed">*</span> : {dictionary.requiredFields})
			</h4>
			<div className="row">
				{/* TODO Work on consistency between different Rmes fields markup (for
           instance, `InputRmes` includes the label and the star). */}
				<InputRmes
					colMd={6}
					label={dictionary.concept.label}
					flag={flagFr}
					star
					value={prefLabelLg1}
					handleChange={handlers.prefLabelLg1}
				/>
				<InputRmes
					colMd={6}
					label={dictionary.concept.label}
					flag={flagEn}
					hiddenStar
					value={prefLabelLg2}
					handleChange={handlers.prefLabelLg2}
				/>
			</div>
			<InputMultiRmes
				inputLg1={altLabelLg1}
				inputLg2={altLabelLg2}
				label={dictionary.concept.altLabel}
				handleChangeLg1={handlers.altLabelLg1}
				handleChangeLg2={handlers.altLabelLg2}
			/>
			<div className="form-group">
				<label>
					{dictionary.concept.creator} <span className="boldRed">*</span>
				</label>
				<SelectRmes
					className="form-control"
					placeholder={dictionary.concept.stamps.defaultValue}
					value={creator}
					options={stampList.map(stamp => ({ label: stamp, value: stamp }))}
					onChange={handlers.creator}
					searchable={true}
				/>
			</div>
			<div className="form-group">
				<label>{dictionary.concept.contributor}</label>
				<input
					type="text"
					className="form-control"
					defaultValue={contributor}
					disabled
				/>
			</div>
			<div className="form-group">
				<label>
					{dictionary.concept.disseminationStatus.title}{' '}
					<span className="boldRed">*</span>
				</label>
				<SelectRmes
					className="form-control"
					placeholder={dictionary.concept.disseminationStatus.defaultValue}
					value={disseminationStatus}
					options={disseminationStatusList.map(({ url: value, label }) => ({
						label,
						value,
					}))}
					onChange={handlers.disseminationStatus}
					searchable={true}
				/>
			</div>
			<div className="form-group">
				<label>{dictionary.concept.additionalMaterial}</label>
				<div className="input-group">
					<span className="input-group-addon">http://</span>
					{/* TODO previous version worked with `defaultValue`
                  -> check if everything is ok */}
					<input
						type="text"
						className="form-control"
						value={additionalMaterial.replace('http://', '')}
						onChange={e => handlers.additionalMaterial(e.target.value)}
					/>
				</div>
			</div>
			<div className="form-group">
				<label>{dictionary.concept.valid}</label>
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
};

export default ConceptGeneralEdition;
