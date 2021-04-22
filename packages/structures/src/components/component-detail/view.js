import React, { useState, useEffect } from 'react';
import {
	Note,
	UpdateButton,
	ActionToolbar,
	ReturnButton,
	DeleteButton,
	ErrorBloc

} from '@inseefr/wilco';
import { Link } from 'react-router-dom';
import { typeUriToLabel, getAllAttachment, getDisseminationStatus } from '../../utils';
import { XSD_CODE_LIST, XSD_TYPES } from '../../utils/constants/xsd';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import { ATTRIBUTE_TYPE } from '../../utils/constants/dsd-components';
import { HTMLUtils, ValidationButton, DateUtils, PublicationMale } from 'bauhaus-utilities';
import PropTypes from 'prop-types';
import "./view.scss";
import { CodesListPanel } from '../codes-list-panel/codes-list-panel';

export const canBeDeleted = (component) => {
	const withoutStructuresUsingThisComponent = !component.structures || component.structures?.length === 0
	const forbidden = ['Validated', 'Modified'];
	return (
		withoutStructuresUsingThisComponent &&
		!forbidden.includes(component.validationState)
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
	secondLang,
	structureComponents,
	col = 3,
	publishComponent,
	serverSideError
}) => {
	const [codesListPanelOpened, setCodesListPanelOpened] = useState(false);

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


	const publish = () => {
		publishComponent()
	}
	return (
		<React.Fragment>
			<ActionToolbar>
				<ReturnButton action={handleBack} col={col} />
				{canBeDeleted(component) && (
					<DeleteButton action={handleDelete} col={col} />
				)}
				<ValidationButton callback={publish} object={component} />
				{updatable && <UpdateButton action={handleUpdate} col={col} />}
			</ActionToolbar>
			<ErrorBloc error={serverSideError} />
			<div className="row">
				<Note
					text={
						<ul>
							<li>
								{D1.idTitle} : {component.identifiant}
							</li>
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
								<PublicationMale object={component} />
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
								{getDisseminationStatus(component.disseminationStatus)}
							</li>
						</ul>
					}
					title={D.globalInformationsTitle}
					alone={true}
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
						text={
							<div className="code-list-zone-view">
								{codeListValue}
								<button
									type="button"
									onClick={() => setCodesListPanelOpened(true)}
								>
									{D.see}
								</button>
							</div>
						}
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
			<CodesListPanel codesList={codesLists.find((c) =>
				(component.codeList?.id || component.codeList)?.toString().includes(c.id?.toString())
			)} isOpen={codesListPanelOpened} handleBack={() => setCodesListPanelOpened(false)}/>
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
	secondLang: PropTypes.bool
};

ComponentDetailView.defaultProps = {
	structureComponents: [],
	concepts: [],
	codesLists: [],
};
