import React from 'react';
import PropTypes from 'prop-types';
import D, { D1, D2 } from 'js/i18n';
import InputRmes from 'js/applications/shared/input-rmes';
import {
	propTypes as generalPropTypes,
	fields as generalFields,
} from 'js/utils/collections/general';
import { RequiredIcon } from 'bauhaus-utilities'
import { CreatorsInput } from 'bauhaus-operations'
const handleFieldChange = handleChange =>
	generalFields.reduce((handlers, fieldName) => {
		handlers[fieldName] = value => handleChange({ [fieldName]: value });
		return handlers;
	}, {});

function CollectionGeneralEdition({
	general,
	creation,
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
			<h4 className="text-center">
				( <RequiredIcon /> : {D.requiredFields})
			</h4>
			<div className="row">
				<InputRmes
					colMd={12}
					label={D1.idTitle}
					lang={lg1}
					star
					value={id}
					disabled={!creation}
					handleChange={handlers.id}
					className="w-100"
				/>
			</div>
			<div className="row">
				<InputRmes
					colMd={6}
					label={D1.labelTitle}
					lang={lg1}
					star
					value={prefLabelLg1}
					handleChange={handlers.prefLabelLg1}
					className="w-100"
				/>
				<InputRmes
					colMd={6}
					label={D2.labelTitle}
					lang={lg2}
					hiddenStar
					value={prefLabelLg2}
					handleChange={handlers.prefLabelLg2}
					className="w-100"
				/>
			</div>

			<div className="form-group">
				<CreatorsInput
					multi={false}
					value={creator}
					onChange={handlers.creator}
				/>
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
			<div className="row">
				<InputRmes
					colMd={6}
					label={D1.descriptionTitle}
					lang={lg1}
					value={descriptionLg1}
					handleChange={handlers.descriptionLg1}
					className="w-100"
				/>
				<InputRmes
					colMd={6}
					label={D2.descriptionTitle}
					lang={lg2}
					value={descriptionLg2}
					handleChange={handlers.descriptionLg2}
					className="w-100"
				/>
			</div>
		</div>
	);
}

CollectionGeneralEdition.propTypes = {
	general: generalPropTypes.isRequired,
	creation: PropTypes.bool,
	handleChange: PropTypes.func.isRequired,
	langs: PropTypes.object.isRequired,
};

export default CollectionGeneralEdition;
