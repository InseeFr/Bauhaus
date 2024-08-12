import { Link } from 'react-router-dom';
import {
	Note,
	UpdateButton,
	DeleteButton,
	ActionToolbar,
	ReturnButton,
	ErrorBloc,
	Table,
} from '@inseefr/wilco';
import { renderMarkdownElement } from '../../../../new-architecture/utils/html-utils';
import {
	ConfirmationDelete,
	CreationUpdateItems,
	Auth,
} from '../../../../utils';

import D, { D1, D2 } from '../../i18n/build-dictionary';
import { CollapsiblePanel } from '../collapsible-panel';
import { rowParams } from '../code-detail/code-columns';
import {
	PublicationFemale,
	Row,
	ValidationButton,
	ContributorsVisualisation,
	DisseminationStatusVisualisation,
} from '../../../../new-architecture/components';
import { useTitle } from '../../../../new-architecture/utils/hooks/useTitle';

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

	const descriptionLg1 = renderMarkdownElement(codelist.descriptionLg1);
	const descriptionLg2 = renderMarkdownElement(codelist.descriptionLg2);

	const publish = () => {
		publishComponent();
	};
	const codes = Object.values(codelist.codes || {});

	return (
		<>
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
				<Row>
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
									<ContributorsVisualisation
										contributors={codelist.contributor}
									/>
								</li>
								<li>
									<DisseminationStatusVisualisation
										disseminationStatus={codelist.disseminationStatus}
									/>
								</li>
							</ul>
						}
						title={D.globalInformationsTitle}
						alone={true}
					/>
				</Row>
			}
			<Row>
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
			</Row>
			{codelist.codes && (
				<Row>
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
				</Row>
			)}
		</>
	);
};
