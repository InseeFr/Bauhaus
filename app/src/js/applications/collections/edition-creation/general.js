import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import SelectRmes from 'js/applications/shared/select-rmes';
import InputRmes from 'js/applications/shared/input-rmes';
import {
	propTypes as generalPropTypes,
	fields as generalFields,
} from 'js/utils/collections/general';

const handleFieldChange = handleChange =>
	generalFields.reduce((handlers, fieldName) => {
		handlers[fieldName] = value => handleChange({ [fieldName]: value });
		return handlers;
	}, {});

function CollectionGeneralEdition({
	general,
	creation,
	stampList,
	handleChange,
	langs,
}) {
	const {
		id,
		prefLabelLg1,
		prefLabelLg2,
		creator,
		contributor,
		descriptionLg1,
		descriptionLg2,
	} = general;
	const { lg1, lg2 } = langs;

	const handlers = handleFieldChange(handleChange);
	return (
		<div>
			<h4 className="centered">
				( <span className="boldRed">*</span> : {D.requiredFields})
			</h4>
			<div className="row">
				{creation && (
					<InputRmes
						colMd={12}
						label={D.idTitle}
						lang={lg1}
						star
						value={id}
						handleChange={handlers.id}
					/>
				)}
				{!creation && (
					<InputRmes
						colMd={12}
						label={D.idTitle}
						lang={lg1}
						star
						value={id}
						disabled
						handleChange={handlers.id}
					/>
				)}
			</div>
			<div className="row">
				<InputRmes
					colMd={12}
					label={D.labelTitle}
					lang={lg1}
					star
					value={prefLabelLg1}
					handleChange={handlers.prefLabelLg1}
				/>
			</div>
			<div className="row">
				<InputRmes
					colMd={12}
					label={D.labelTitle}
					lang={lg2}
					hiddenStar
					value={prefLabelLg2}
					handleChange={handlers.prefLabelLg2}
				/>
			</div>
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
			<div className="row">
				<InputRmes
					colMd={12}
					label={D.descriptionTitle}
					lang={lg1}
					value={descriptionLg1}
					handleChange={handlers.descriptionLg1}
				/>
			</div>
			<div className="row">
				<InputRmes
					colMd={12}
					label={D.descriptionTitle}
					lang={lg2}
					value={descriptionLg2}
					handleChange={handlers.descriptionLg2}
				/>
			</div>
		</div>
	);
}

CollectionGeneralEdition.propTypes = {
	general: generalPropTypes.isRequired,
	creation: PropTypes.bool,
	handleChange: PropTypes.func.isRequired,
	stampList: PropTypes.array.isRequired,
	langs: PropTypes.object.isRequired,
};

export default CollectionGeneralEdition;
