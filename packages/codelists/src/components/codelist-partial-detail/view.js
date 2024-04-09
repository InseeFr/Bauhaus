import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
	Note,
	UpdateButton,
	DeleteButton,
	ActionToolbar,
	ReturnButton,
	ErrorBloc,
	Table,
} from '@inseefr/wilco';
import {
	HTMLUtils,
	ValidationButton,
	PublicationFemale,
	useTitle,
	ConfirmationDelete,
	CreationUpdateItems,
	Auth,
} from 'bauhaus-utilities';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import { CollapsiblePanel } from '../collapsible-panel';
import { rowParams } from '../code-detail/code-columns';

export const CodeListPartialDetailView = ({
	codelist,
	handleUpdate,
	handleDelete,
	handleBack,
	updatable,
	deletable,
	modalOpened,
	handleYes,
	handleNo,
	secondLang,
	col = 3,
	publishComponent,
	serverSideError,
	hidden = false,
}) => {
	useTitle(D.codelistsPartialTitle, codelist?.labelLg1);

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

	return (
		<React.Fragment>
			{modalOpened && (
				<ConfirmationDelete
					className="codelists"
					handleNo={handleNo}
					handleYes={handleYes}
					message={D.confirmationCodelistDelete}
				/>
			)}
			<ActionToolbar>
				<ReturnButton action={handleBack} col={col} />
				<Auth.AuthGuard roles={[Auth.ADMIN]}>
					<ValidationButton callback={publish} object={codelist} />
					{updatable && <UpdateButton action={handleUpdate} col={col} />}
					{deletable && <DeleteButton action={handleDelete} col={col} />}
				</Auth.AuthGuard>
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
									{D.parentCodelist} :{' '}
									<Link to={`/codelists/${codelist.parentCode}`}>
										{codelist.parentLabel}
									</Link>
								</li>
								<CreationUpdateItems
									creation={codelist.created}
									update={codelist.modified}
								/>
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
		</React.Fragment>
	);
};

CodeListPartialDetailView.propTypes = {
	codelist: PropTypes.object,
	handleUpdate: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
	handleBack: PropTypes.func,
	updatable: PropTypes.bool,
};
