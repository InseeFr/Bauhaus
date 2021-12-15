import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	Note,
	UpdateButton,
	ActionToolbar,
	ReturnButton,
	ErrorBloc,
	Table,
} from '@inseefr/wilco';
import {
	HTMLUtils,
	ValidationButton,
	DateUtils,
	PublicationFemale,
	useTitle,
} from 'bauhaus-utilities';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import { CollapsiblePanel } from '../collapsible-panel';
import { treedData } from '../../utils';
import { rowParams } from '../code-detail/code-columns';
import CodesTreeView from '../codelist-detail/codes-tree-view';

export const CodeListPartialDetailView = ({
	codelist,
	handleUpdate,
	handleBack,
	updatable,
	secondLang,
	col = 3,
	publishComponent,
	serverSideError,
	hidden = false,
}) => {
	useTitle(D.codelistPartialTitle, codelist?.labelLg1);

	const descriptionLg1 = HTMLUtils.renderMarkdownElement(
		codelist.descriptionLg1
	);
	const descriptionLg2 = HTMLUtils.renderMarkdownElement(
		codelist.descriptionLg2
	);

	const publish = () => {
		publishComponent();
	};

	const codes = Object.values(codelist.codes || {});
	const [tree, setTree] = useState(treedData(codes));

	return (
		<React.Fragment>
			<ActionToolbar>
				<ReturnButton action={handleBack} col={col} />
				<ValidationButton callback={publish} object={codelist} />
				{updatable && <UpdateButton action={handleUpdate} col={col} />}
			</ActionToolbar>
			<ErrorBloc error={serverSideError} />
			{
				<div className="row">
					<Note
						text={
							<ul>
								<li>
									{D.idTitle} : {codelist.id}
								</li>
								<li>
									{D.createdDateTitle} :{' '}
									{DateUtils.stringToDate(codelist.created)}
								</li>
								<li>
									{D.modifiedDateTitle} :{' '}
									{DateUtils.stringToDate(codelist.modified)}
								</li>
								<li>
									{D.codelistValidationStatusTitle} :{' '}
									<PublicationFemale object={codelist} />
								</li>
								<li>
									{D.creator} : {codelist.creator}
								</li>
								<li>
									{D.contributor} : {codelist.contributor}
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
			{codelist.codes && (
				<div className="row">
					<CollapsiblePanel
						id="code-array"
						hidden={hidden}
						title={D.listElements}
						children={
							<Table
								rowParams={rowParams}
								data={codes.sort((a, b) => (a.code > b.code ? 1 : -1))}
							/>
						}
					/>
				</div>
			)}
			{codelist.codes && codes.filter((code) => code.parents).length > 0 && (
				<div className="row">
					<CodesTreeView
						codes={codes}
						tree={tree}
						handleChangeTree={(tree) => setTree(tree)}
						handleAdd={false}
						readOnly={true}
					/>
				</div>
			)}
		</React.Fragment>
	);
};

CodeListPartialDetailView.propTypes = {
	codelist: PropTypes.object,
	handleUpdate: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
	handleBack: PropTypes.func,
	updatable: PropTypes.bool,
};
