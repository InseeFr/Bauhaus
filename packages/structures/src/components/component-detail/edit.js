import React from 'react';
import { CancelButton, SaveButton, ActionToolbar } from '@inseefr/wilco';
import { typeUriToLabel } from '../../utils';

import D from '../../i18n/build-dictionary';

export const ComponentDetailEdit = ({
	component,
	concepts,
	codesLists,
	handleSave,
	handleBack,
}) => {
	const typeValue = typeUriToLabel(component.type);
	const conceptValue = concepts[component.concept]?.label;
	const codeListValue = codesLists[component.codeList]?.label;
	return (
		<React.Fragment>
			<ActionToolbar>
				<CancelButton action={handleBack} col="3" />
				<SaveButton action={handleSave} col="3" />
			</ActionToolbar>

			<form>
				<div className="row">
					<div className="col-md-12 form-group">
						<label htmlFor="type">{D.conceptTitle}</label>
						<input
							type="text"
							className="form-control"
							id="type"
							value={typeValue}
							disabled
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 form-group">
						<label htmlFor="codeList">{D.codesListTitle}</label>
						<input
							type="text"
							className="form-control"
							id="codeList"
							value={codeListValue}
							disabled
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 form-group">
						<label htmlFor="concept">{D.conceptTitle}</label>
						<input
							type="text"
							className="form-control"
							id="concept"
							value={conceptValue}
							disabled
						/>
					</div>
				</div>
			</form>
		</React.Fragment>
	);
};
