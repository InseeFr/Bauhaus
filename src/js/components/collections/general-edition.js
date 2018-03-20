import React from 'react';
import PropTypes from 'prop-types';
import { dictionary } from 'js/utils/dictionary';
import SelectRmes from 'js/components/shared/select-rmes';
import InputRmes from 'js/components/shared/input-rmes';
import {
	propTypes as generalPropTypes,
	fields as generalFields,
} from 'js/utils/collections/general';

//TODO make an utility function (see `notes-edition.js` for another usage)
const handleFieldChange = handleChange =>
	//TODO rewrite fields (required should be handled elsewhere)
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
				( <span className="boldRed">*</span> : {dictionary.requiredFields})
			</h4>
			<div className="row">
				{creation && (
					<InputRmes
						colMd={12}
						label={dictionary.collection.id}
						lang={lg1}
						star
						value={id}
						handleChange={handlers.id}
					/>
				)}
				{!creation && (
					<InputRmes
						colMd={12}
						label={dictionary.collection.id}
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
					label={dictionary.collection.label}
					lang={lg1}
					star
					value={prefLabelLg1}
					handleChange={handlers.prefLabelLg1}
				/>
			</div>
			<div className="row">
				<InputRmes
					colMd={12}
					label={dictionary.collection.label}
					lang={lg2}
					hiddenStar
					value={prefLabelLg2}
					handleChange={handlers.prefLabelLg2}
				/>
			</div>
			<div className="form-group">
				<label>
					{dictionary.collection.creator} <span className="boldRed">*</span>
				</label>
				<SelectRmes
					className="form-control"
					placeholder={dictionary.collection.stamps.defaultValue}
					value={creator}
					options={stampList.map(stamp => ({ label: stamp, value: stamp }))}
					onChange={handlers.creator}
					searchable={true}
				/>
			</div>
			<div className="form-group">
				<label>{dictionary.collection.contributor}</label>
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
					label={dictionary.collection.description}
					lang={lg1}
					value={descriptionLg1}
					handleChange={handlers.descriptionLg1}
				/>
			</div>
			<div className="row">
				<InputRmes
					colMd={12}
					label={dictionary.collection.description}
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
