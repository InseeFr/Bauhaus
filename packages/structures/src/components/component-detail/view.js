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
import { ATTRIBUTE_TYPE, MEASURE_PROPERTY_TYPE } from '../../utils/constants/dsd-components';
import { HTMLUtils, ValidationButton, CreationUpdateItems, PublicationMale,useTitle, Row } from 'bauhaus-utilities';
import PropTypes from 'prop-types';
import "./view.scss";
import { CodesListPanel } from '../codes-list-panel/codes-list-panel';
import { API } from 'bauhaus-codelists'
import api from '../../apis/structure-api';

export const canBeDeleted = (component) => {
	const withoutStructuresUsingThisComponent = !component.structures || component.structures?.length === 0
	const forbidden = ['Validated', 'Modified'];
	return (
		withoutStructuresUsingThisComponent &&
		!forbidden.includes(component.validationState)
	);
};

export const MeasureAttributeCodeValue = ({ value, attribute, codesLists }) => {
	const [codesList, setCodesList] = useState();
	const codeListNotation = codesLists.find(cl => cl.id === attribute.codeList)?.notation;

	useEffect(() => {
		API.getCodelist(codeListNotation).then(cl => setCodesList(cl))
	}, [codeListNotation])

	if(!codesList){
		return null;
	}

	const code = codesList.codes.find(c => c.iri === value);
	return <React.Fragment>{ code?.labelLg1 }</React.Fragment>
};

export const MeasureAttributeValue = ({ value, attribute, codesLists }) => {
	if(attribute.range === XSD_CODE_LIST){
		return <MeasureAttributeCodeValue value={value} attribute={attribute} codesLists={codesLists}/>
	}
	return <React.Fragment>{ value }</React.Fragment>
}
export const MeasureAttribute = ({ attribute, value, attributes, codesLists }) => {
	const attributeId = attributes.find(a => a.iri === attribute)?.id
	const [fullAttribute, setFullAttribute] = useState();

	useEffect(() => {
		api.getMutualizedComponent(attributeId).then(body => setFullAttribute(body))
	}, [attributeId]);

	if(!fullAttribute){
		return null;
	}

	return <React.Fragment>{fullAttribute?.labelLg1}: <MeasureAttributeValue value={value} attribute={fullAttribute} codesLists={codesLists}/></React.Fragment>
}
export const MeasureAttributes = ({ measure, attributes, codesLists }) => {
	const measureAttributes = Object.keys(measure).filter(key => key.indexOf("attribute_") === 0).map(key => {
		const index = key.substring(key.indexOf("_") + 1);
		return [measure["attribute_" + index], measure["attributeValue_" + index]]
	})
	return (
		<ul>
			{
				measureAttributes.map(([ key, value ]) => <li key={key}><MeasureAttribute attribute={key} value={value} attributes={attributes} codesLists={codesLists}/></li>)
			}
		</ul>
	)
}

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
	serverSideError,
	attributes
}) => {
	useTitle(D.componentTitle, component?.labelLg1)
	const [codesListPanelOpened, setCodesListPanelOpened] = useState(false);
	const [partialCodesLists, setPartialCodesLists] = useState([]);

	useEffect(() => {
		API.getCodelistsPartial().then(response => {
			setPartialCodesLists(response)
		})
	}, [])
	const typeValue = typeUriToLabel(component.type);
	const conceptValue = concepts.find(
		(concept) => concept.id?.toString() === component.concept?.toString()
	)?.label;

	const fullCodeLists = [...codesLists, ...partialCodesLists.map(l => ({ id: l.uri, label: l.labelLg1, notation: l.id}))]
	const codeListValue = fullCodeLists.find((codelist) =>
		component.codeList?.toString() === codelist.id?.toString()
	)?.label;

	const descriptionLg1 = HTMLUtils.renderMarkdownElement(
		component.descriptionLg1
	);
	const descriptionLg2 = HTMLUtils.renderMarkdownElement(
		component.descriptionLg2
	);
	const [attachments, setAttachments] = useState([]);

	useEffect(() => {
		setAttachments(getAllAttachment(structureComponents, { component }));
	}, [structureComponents, component]);


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
							<CreationUpdateItems creation={component.created} update={component.modified} />
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
					text={
						<>
							{XSD_TYPES.find((type) => type.value === component.range)?.label}
							<ul>
								{
									component.pattern && <li>{D.formatTitle}: {component.pattern}</li>
								}
								{
									component.minLength && <li>{D.minLength}: {component.minLength}</li>
								}
								{
									component.maxLength && <li>{D.maxLength}: {component.maxLength}</li>
								}
								{
									component.minInclusive && <li>{D.minInclusive}: {component.minInclusive}</li>
								}
								{
									component.maxInclusive && <li>{D.maxInclusive}: {component.maxInclusive}</li>
								}
							</ul>
						</>
					}
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
			{component.type === MEASURE_PROPERTY_TYPE && <Row>
				<Note
					text={<MeasureAttributes measure={component} attributes={attributes} codesLists={codesLists}/>}
					title={D1.Attribute}
					alone={true}
					allowEmpty={true}
				/>
			</Row>}
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
			<CodesListPanel codesList={fullCodeLists.find((c) =>
				(component.codeList?.id || component.codeList)?.toString() === c.id?.toString()
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
