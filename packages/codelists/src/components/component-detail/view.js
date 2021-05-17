import React from 'react';
import {
	Note,
	UpdateButton,
	ActionToolbar,
	ReturnButton,
	ErrorBloc,
	Table,
} from '@inseefr/wilco';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import {
	HTMLUtils,
	ValidationButton,
	DateUtils,
	PublicationFemale,
} from 'bauhaus-utilities';
import PropTypes from 'prop-types';
import { rowParams } from './code-detail';

export const CodeListDetailView = ({
	component,
	handleUpdate,
	handleBack,
	updatable,
	secondLang,
	col = 3,
	publishComponent,
	serverSideError,
}) => {
	const descriptionLg1 = HTMLUtils.renderMarkdownElement(
		component.descriptionLg1
	);
	const descriptionLg2 = HTMLUtils.renderMarkdownElement(
		component.descriptionLg2
	);

	const publish = () => {
		publishComponent();
	};

	return (
		<React.Fragment>
			<ActionToolbar>
				<ReturnButton action={handleBack} col={col} />
				<ValidationButton callback={publish} object={component} />
				{updatable && <UpdateButton action={handleUpdate} col={col} />}
			</ActionToolbar>
			<ErrorBloc error={serverSideError} />
			{
				<div className="row">
					<Note
						text={
							<ul>
								<li>
									{D.idTitle} : {component.id}
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
									{D.codelistValidationStatusTitle} :{' '}
									<PublicationFemale object={component} />
								</li>
								<li>
									{D.creator} : {component.creator}
								</li>
								<li>
									{D.contributor} : {component.contributor}
								</li>
							</ul>
						}
						title={D.globalInformationsTitle}
						alone={true}
					/>
				</div>
			}
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
			{
				<div className="row">
					<Note
						text={
							<Table
								rowParams={rowParams}
								data={Object.values(component.codes)}
							/>
						}
						title={D.listElements}
						alone={true}
					/>
				</div>
			}
		</React.Fragment>
	);
};

CodeListDetailView.propTypes = {
	component: PropTypes.object,
	concepts: PropTypes.array,
	codesLists: PropTypes.array,
	handleUpdate: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
	handleBack: PropTypes.func,
	updatable: PropTypes.bool,
	structureComponents: PropTypes.array,
};

CodeListDetailView.defaultProps = {
	structureComponents: [],
	concepts: [],
	codesLists: [],
};
