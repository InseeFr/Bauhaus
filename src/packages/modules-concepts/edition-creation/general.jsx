import { CreatorsInput } from '@components/creators-input';
import { DatePicker } from '@components/date-picker';
import { DisseminationStatusInput } from '@components/dissemination-status/disseminationStatus';
import { ClientSideError } from '@components/errors-bloc';
import { TextInput } from '@components/form/input';
import { InputMultiRmes } from '@components/input-multi-rmes';
import { InputRmes } from '@components/input-rmes';
import { Row } from '@components/layout';
import { RequiredIcon } from '@components/required-icon';

import D, { D1, D2 } from '../../deprecated-locales';
import { fields as generalFields } from '../utils/general';

const handleFieldChange = (handleChange) =>
	generalFields.reduce((handlers, fieldName) => {
		handlers[fieldName] = (value) => handleChange({ [fieldName]: value });
		return handlers;
	}, {});

function ConceptGeneralEdition({ general, handleChange, errorMessage }) {
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
			<h4 className="text-center">
				( <RequiredIcon /> : {D.requiredFields})
			</h4>
			<Row>
				<InputRmes
					colMd={6}
					label={D1.labelTitle}
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
					hiddenStar
					value={prefLabelLg2}
					handleChange={handlers.prefLabelLg2}
					className="w-100"
				/>
			</Row>
			<InputMultiRmes
				inputLg1={altLabelLg1}
				inputLg2={altLabelLg2}
				label="altLabelTitle"
				handleChangeLg1={handlers.altLabelLg1}
				handleChangeLg2={handlers.altLabelLg2}
			/>
			<div className="form-group">
				<CreatorsInput value={creator} onChange={handlers.creator} />
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
					required
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
						value={additionalMaterial?.replace('http://', '')}
						onChange={(e) => handlers.additionalMaterial(e.target.value)}
					/>
				</div>
			</div>
			<div className="form-group">
				<label>{D1.validDateTitle}</label>
				<DatePicker value={valid} onChange={handlers.valid} placement="top" />
			</div>
		</div>
	);
}

export default ConceptGeneralEdition;
