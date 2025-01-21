import { Link } from 'react-router-dom';

import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ConfirmationDelete } from '@components/confirmation-delete';
import { ContributorsVisualisation } from '@components/contributors/contributors';
import { CreationUpdateItems } from '@components/creation-update-items';
import { DisseminationStatusVisualisation } from '@components/dissemination-status/disseminationStatus';
import { ErrorBloc } from '@components/errors-bloc';
import { Row } from '@components/layout';
import { Note } from '@components/note';
import { PublicationFemale } from '@components/status';
import { ValidationButton } from '@components/validationButton';

import { useTitle } from '@utils/hooks/useTitle';
import { renderMarkdownElement } from '@utils/html-utils';

import Auth from '../../../auth/components/auth';
import { ADMIN } from '../../../auth/roles';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import { CollapsiblePanel } from '../collapsible-panel';

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
				<Auth roles={[ADMIN]}>
					<ValidationButton callback={publish} object={codelist} />
					{updatable && <UpdateButton action={handleUpdate} col={col} />}
					{deletable && <DeleteButton action={handleDelete} col={col} />}
				</Auth>
			</ActionToolbar>
			<ErrorBloc error={serverSideError} />
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
						children={<></>}
					/>
				</Row>
			)}
		</>
	);
};
