import React, { useState, useEffect } from 'react';
import {
	Note,
	UpdateButton,
	ActionToolbar,
	ReturnButton,
	DeleteButton,
} from '@inseefr/wilco';
import { Link } from 'react-router-dom';
import { typeUriToLabel, getAllAttachment } from '../../utils';
import { XSD_CODE_LIST, XSD_TYPES } from '../../utils/constants/xsd';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import { ATTRIBUTE_TYPE } from '../../utils/constants/dsd-components';
import { HTMLUtils, ValidationButton, DateUtils } from 'bauhaus-utilities';
import PropTypes from 'prop-types';

export const canBeDeleted = (component) => {
	const forbidden = ['Validated', 'Modified'];
	return (
		!forbidden.includes(component.validationState) &&
		!component.structures?.find((structure) =>
			forbidden.includes(structure.validationState)
		)
	);
};
export const ComponentDetailView = ({
	component,
	concepts,
	codesLists,
	handleUpdate,
	handleDelete,
	handleBack,
	updatable,
	mutualized = false,
	secondLang = false,
	structureComponents,
	col = 3,
}) => {
	const typeValue = typeUriToLabel(component.type);
	const conceptValue = concepts.find(
		(concept) => concept.id?.toString() === component.concept?.toString()
	)?.label;
	const codeListValue = codesLists.find((concept) =>
		component.codeList?.toString().includes(concept.id?.toString())
	)?.label;
	const descriptionLg1 = HTMLUtils.renderMarkdownElement(
		component.descriptionLg1
	);
	const descriptionLg2 = HTMLUtils.renderMarkdownElement(
		component.descriptionLg2
	);
	const [attachments, setAttachments] = useState([]);

	useEffect(() => {
		setAttachments(getAllAttachment(structureComponents));
	}, [structureComponents]);

	return (
		<React.Fragment>
			<ActionToolbar>
				<ReturnButton action={handleBack} col={col} />
				{canBeDeleted(component) && (
					<DeleteButton action={handleDelete} col={col} />
				)}
				<ValidationButton object={component} />
				{updatable && <UpdateButton action={handleUpdate} col={col} />}
			</ActionToolbar>
			<div className="row">
				<Note
					text={
						<ul>
							<li>
								{D.createdDateTitle} :{' '}
								{DateUtils.stringToDate(component.created)}
							</li>
							<li>
								{D.modifiedDateTitle} :{' '}
								{DateUtils.stringToDate(component.modified)}
							</li>
							<li>
								{D.componentValididationStatusTitle} :{' '}
								{component.validationState}
							</li>
							<li>
								{D.creator} :{' '}
								{component.creator}
							</li>
							<li>
								{D.contributor} :{' '}
								{component.contributor}
							</li>
							<li>
								{D.disseminationStatusTitle} :{' '}
								{component.disseminationStatus}
							</li>
						</ul>
					}
					title={D.globalInformationsTitle}
					alone={true}
				/>
			</div>
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
					text={XSD_TYPES.find((type) => type.value === component.range)?.label}
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
			{mutualized && component.structures?.length > 0 && (
				<div className="row">
					<Note
						text={
							<ul>
								{component.structures?.map((structure) => {
									return (
										<li key={structure.id}>
											<Link to={`/structures/${structure.id}`}>
												{structure.labelLg1}
											</Link>
										</li>
									);
								})}
							</ul>
						}
						title={D1.structuresComponentTitle}
						alone={true}
						allowEmpty={true}
					/>
				</div>
			)}
			{component.type === ATTRIBUTE_TYPE && !mutualized && (
				<React.Fragment>
					<hr />
					<h4>{D1.componentSpecificationTitle}</h4>

					<div className="row">
						<Note
							text={
								<ul>
									{component.attachment?.map((attachment) => {
										return (
											<li key={attachment}>
												{
													attachments.find((type) => type.value === attachment)
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
					<div className="row">
						<Note
							text={component.required ? D.yes : D.no}
							title={D1.requiredSpecificationTitle}
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
	structureComponents: PropTypes.array,
};

ComponentDetailView.defaultProps = {
	structureComponents: [],
	concepts: [],
	codesLists: [],
};
