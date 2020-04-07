import React from 'react';
import {
	Note,
	CancelButton,
	UpdateButton,
	ActionToolbar,
} from '@inseefr/wilco';
import { typeUriToLabel } from '../../utils';

import { D1 } from '../../i18n/build-dictionary';

export const ComponentDetailView = ({
	component,
	concepts,
	codesLists,
	handleUpdate,
	handleBack,
}) => {
	const typeValue = typeUriToLabel(component.type);
	const conceptValue = concepts[component.concept]?.label;
	const codeListValue = codesLists[component.codeList]?.label;
	return (
		<React.Fragment>
			<ActionToolbar>
				<CancelButton action={handleBack} col="3" />
				<UpdateButton action={handleUpdate} col="3" />
			</ActionToolbar>

			<div className="row">
				<Note text={typeValue} title={D1.type} alone={true} allowEmpty={true} />
			</div>
			<div className="row">
				<Note
					text={codeListValue}
					title={D1.codesListTitle}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<div className="row">
				<Note
					text={conceptValue}
					title={D1.type}
					alone={true}
					allowEmpty={true}
				/>
			</div>
		</React.Fragment>
	);
};
