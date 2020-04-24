import React from 'react';
import {
	Note,
	UpdateButton,
	ActionToolbar,
	ReturnButton,
} from '@inseefr/wilco';
import { typeUriToLabel } from '../../utils';
import { XSD_CODE_LIST, XSD_TYPES } from '../../utils/constants/xsd';
import { D1, D2 } from '../../i18n/build-dictionary';
import { ATTRIBUTE_TYPE } from '../../utils/constants/dsd-components';
import { ATTACHMENTS } from '../../utils/constants/attachments';
import { HTMLUtils, ValidationButton } from 'bauhaus-utilities';
import PropTypes from 'prop-types';

export const ComponentDetailView = ({
	component,
	concepts,
	codesLists,
	handleUpdate,
	handleBack,
	updatable = true,
	mutualized = false,
	secondLang = false,
	col = 3,
}) => {
	const typeValue = typeUriToLabel(component.type);
	const conceptValue = concepts.find(
		concept => concept.id?.toString() === component.concept?.toString()
	)?.label;
	const codeListValue = codesLists.find(
		concept => concept.id?.toString() === component.codeList?.toString()
	)?.label;
	const descriptionLg1 = HTMLUtils.renderMarkdownElement(
		component.descriptionLg1
	);
	const descriptionLg2 = HTMLUtils.renderMarkdownElement(
		component.descriptionLg2
	);

	return (
		<React.Fragment>
			<ActionToolbar>
				<ReturnButton action={handleBack} col={col} />
				<ValidationButton object={component} />
				{updatable && <UpdateButton action={handleUpdate} col={col} />}
			</ActionToolbar>

			<div className="row">
				<Note
					text={component.identifiant}
					title={D1.idTitle}
					alone={true}
					allowEmpty={true}
				/>
			</div>
			<div className="row">
				<Note text={typeValue} title={D1.type} alone={true} allowEmpty={true} />
			</div>

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
			<div className="row">
				<Note
					text={descriptionLg1}
					title={D1.descriptionTitle}
					alone={!secondLang}
					allowEmpty={true}
					md
				/>
				{secondLang && (
					<Note
						text={descriptionLg2}
						title={D2.descriptionTitle}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>
			{component.type === ATTRIBUTE_TYPE && !mutualized && (
				<React.Fragment>
					<hr />
					<h4>{D1.componentSpecificationTitle}</h4>

					<div className="row">
						<Note
							text={
								<ul>
									{component.attachment?.map(attachment => {
										return (
											<li key={attachment}>
												{
													ATTACHMENTS.find(type => type.value === attachment)
														?.label
												}
											</li>
										);
									})}
								</ul>
							}
							title={D1.attachmentTitle}
							alone={true}
							allowEmpty={true}
						/>
					</div>
				</React.Fragment>
			)}
		</React.Fragment>
	);
};

ComponentDetailView.propTypes = {
	component: PropTypes.object,
	concepts: PropTypes.array,
	codesLists: PropTypes.array,
	handleUpdate: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
	handleBack: PropTypes.func,
	updatable: PropTypes.bool,
};
