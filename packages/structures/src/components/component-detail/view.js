import React from 'react';
import {
	Note,
	CancelButton,
	UpdateButton,
	ActionToolbar,
} from '@inseefr/wilco';
import { typeUriToLabel } from '../../utils';
import { XSD_CODE_LIST, XSD_TYPES } from '../../utils/constants/xsd';
import { D1 } from '../../i18n/build-dictionary';
import { ATTRIBUTE_TYPE } from '../../utils/constants/dsd-components';
import { ATTACHMENTS } from '../../utils/constants/attachments';

export const ComponentDetailView = ({
	component,
	concepts,
	codesLists,
	handleUpdate,
	handleBack,
	updatable = true,
}) => {
	const typeValue = typeUriToLabel(component.type);
	const conceptValue = concepts[component.concept]?.label;
	const codeListValue = codesLists[component.codeList]?.label;

	return (
		<React.Fragment>
			<ActionToolbar>
				<CancelButton action={handleBack} col="3" />
				{updatable && <UpdateButton action={handleUpdate} col="3" />}
			</ActionToolbar>

			<div className="row">
				<Note
					text={component.id}
					title={D1.idTitle}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<div className="row">
				<Note text={typeValue} title={D1.type} alone={true} allowEmpty={true} />
			</div>
			{component.type === ATTRIBUTE_TYPE && (
				<div className="row">
					<Note
						text={
							ATTACHMENTS.find(type => type.value === component.attachment)
								?.label
						}
						title={D1.attachmentTitle}
						alone={true}
						allowEmpty={true}
					/>
				</div>
			)}
			<div className="row">
				<Note
					text={conceptValue}
					title={D1.conceptTitle}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<div className="row">
				<Note
					text={XSD_TYPES.find(type => type.value === component.range)?.label}
					title={D1.rangeTitle}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			{component.range === XSD_CODE_LIST && (
				<div className="row">
					<Note
						text={codeListValue}
						title={D1.codesListTitle}
						alone={true}
						allowEmpty={true}
					/>
				</div>
			)}
		</React.Fragment>
	);
};
