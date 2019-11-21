import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import DatePickerRmes from 'js/applications/shared/date-picker-rmes';
import SelectRmes from 'js/applications/shared/select-rmes';
import InputRmes from 'js/applications/shared/input-rmes';
import InputMultiRmes from 'js/applications/shared/input-multi-rmes';
import {
	propTypes as generalPropTypes,
	fields as generalFields,
} from 'js/utils/concepts/general';

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
				( <span className="boldRed">*</span> : {D.requiredFields})
			</h4>
			<div className="row">
				<InputRmes
					colMd={6}
					label={D.labelTitle}
					lang={langs.lg1}
					star
					value={prefLabelLg1}
					handleChange={handlers.prefLabelLg1}
				/>
				<InputRmes
					colMd={6}
					label={D.labelTitle}
					lang={langs.lg2}
					hiddenStar
					value={prefLabelLg2}
					handleChange={handlers.prefLabelLg2}
				/>
			</div>
			<InputMultiRmes
				inputLg1={altLabelLg1}
				inputLg2={altLabelLg2}
				label={D.altLabelTitle}
				handleChangeLg1={handlers.altLabelLg1}
				handleChangeLg2={handlers.altLabelLg2}
				langs={langs}
			/>
			<div className="form-group">
				<label>
					{D.creatorTitle} <span className="boldRed">*</span>
				</label>
				<SelectRmes
					className="form-control"
					placeholder={D.stampsPlaceholder}
					value={creator}
					options={stampList.map(stamp => ({ label: stamp, value: stamp }))}
					onChange={handlers.creator}
					searchable={true}
				/>
			</div>
			<div className="form-group">
				<label>{D.contributorTitle}</label>
				<input
					type="text"
					className="form-control"
					defaultValue={contributor}
					disabled
				/>
			</div>
			<div className="form-group">
				<label>
					{D.disseminationStatusTitle} <span className="boldRed">*</span>
				</label>
				<SelectRmes
					className="form-control"
					placeholder={D.disseminationStatusPlaceholder}
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
				<label>{D.additionalMaterialTitle}</label>
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
				<label>{D.validDateTitle}</label>
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
