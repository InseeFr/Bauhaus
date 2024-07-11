import { useState, useEffect } from 'react';
import { Note } from '@inseefr/wilco';
import { Link } from 'react-router-dom';
import { typeUriToLabel, getAllAttachment } from '../../utils';
import {
	XSD_CODE_LIST,
	XSD_TYPES,
	ATTRIBUTE_TYPE,
	MEASURE_PROPERTY_TYPE,
} from '../../utils/constants';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import { HTMLUtils, CreationUpdateItems, useTitle, ErrorBloc } from 'js/utils';
import './view.scss';
import { CodesListPanel } from '../codes-list-panel/codes-list-panel';
import { API } from '../../../codelists/apis';
import MainDictionary from '../../../../i18n/build-dictionary';
import { ViewMenu } from './menu';
import { MeasureAttributes } from './visualisation/measureAttributes';
import { DisseminationStatusVisualisation } from '../../../../utils/dissemination-status/disseminationStatus';
import { ContributorsVisualisation } from '../../../../utils/contributors/contributors';
import { PublicationMale, Row } from '../../../../new-architecture/components';

export const ComponentDetailView = ({
	component,
	concepts = [],
	codesLists = [],
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
	attributes,
	langs: { lg1, lg2 },
}) => {
	useTitle(D.componentTitle, component?.labelLg1);
	const [codesListPanelOpened, setCodesListPanelOpened] = useState(false);
	const [partialCodesLists, setPartialCodesLists] = useState([]);

	useEffect(() => {
		API.getCodelistsPartial().then((response) => {
			setPartialCodesLists(response);
		});
	}, []);
	const typeValue = typeUriToLabel(component.type);
	const conceptValue = concepts.find(
		(concept) => concept.id?.toString() === component.concept?.toString()
	)?.label;

	const fullCodeLists = [
		...codesLists,
		...partialCodesLists.map((l) => ({
			id: l.uri,
			label: l.labelLg1,
			notation: l.id,
		})),
	];
	const codeListValue = fullCodeLists.find(
		(codelist) => component.codeList?.toString() === codelist.id?.toString()
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
		publishComponent();
	};
	return (
		<>
			<ViewMenu
				component={component}
				handleBack={handleBack}
				handleDelete={handleDelete}
				handleUpdate={handleUpdate}
				publish={publish}
				updatable={updatable}
				col={col}
			></ViewMenu>

			{serverSideError && (
				<ErrorBloc error={serverSideError} D={MainDictionary} />
			)}
			<Row>
				<Note
					text={
						<ul>
							<li>
								{D1.idTitle} : {component.identifiant}
							</li>
							<CreationUpdateItems
								creation={component.created}
								update={component.modified}
							/>
							<li>
								{D.componentValididationStatusTitle} :{' '}
								<PublicationMale object={component} />
							</li>
							<li>
								{D.creator} : {component.creator}
							</li>
							<li>
								<ContributorsVisualisation
									contributors={component.contributor}
								/>
							</li>
							<li>
								<DisseminationStatusVisualisation
									disseminationStatus={component.disseminationStatus}
								/>
							</li>
						</ul>
					}
					title={D.globalInformationsTitle}
					alone={true}
				/>
			</Row>
			<Row>
				<Note text={typeValue} title={D1.type} alone={true} allowEmpty={true} />
			</Row>
			<Row>
				<Note
					text={component.altLabelLg1}
					title={D1.altLabel}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={component.altLabelLg2}
						title={D2.altLabel}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={conceptValue}
					title={D1.conceptTitle}
					alone={true}
					allowEmpty={true}
				/>
			</Row>
			<Row>
				<Note
					text={
						<>
							{XSD_TYPES.find((type) => type.value === component.range)?.label}
							<ul>
								{component.pattern && (
									<li>
										{D.formatTitle}: {component.pattern}
									</li>
								)}
								{component.minLength && (
									<li>
										{D.minLength}: {component.minLength}
									</li>
								)}
								{component.maxLength && (
									<li>
										{D.maxLength}: {component.maxLength}
									</li>
								)}
								{component.minInclusive && (
									<li>
										{D.minInclusive}: {component.minInclusive}
									</li>
								)}
								{component.maxInclusive && (
									<li>
										{D.maxInclusive}: {component.maxInclusive}
									</li>
								)}
							</ul>
						</>
					}
					title={D1.rangeTitle}
					alone={true}
					allowEmpty={true}
				/>
			</Row>
			{component.range === XSD_CODE_LIST && (
				<Row>
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
				</Row>
			)}
			<Row>
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
			</Row>
			{component.type === MEASURE_PROPERTY_TYPE && (
				<Row>
					<Note
						text={
							<MeasureAttributes
								measure={component}
								attributes={attributes}
								codesLists={codesLists}
							/>
						}
						title={D1.Attribute}
						alone={true}
						allowEmpty={true}
					/>
				</Row>
			)}
			{mutualized && component.structures?.length > 0 && (
				<Row>
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
				</Row>
			)}
			{component.type === ATTRIBUTE_TYPE && !mutualized && (
				<>
					<hr />
					<h4>{D1.componentSpecificationTitle}</h4>

					<Row>
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
					</Row>
					<Row>
						<Note
							text={component.required ? D.yes : D.no}
							title={D1.requiredSpecificationTitle}
							alone={true}
							allowEmpty={true}
						/>
					</Row>
				</>
			)}
			<CodesListPanel
				codesList={fullCodeLists.find(
					(c) =>
						(component.codeList?.id || component.codeList)?.toString() ===
						c.id?.toString()
				)}
				isOpen={codesListPanelOpened}
				handleBack={() => setCodesListPanelOpened(false)}
			/>
		</>
	);
};
