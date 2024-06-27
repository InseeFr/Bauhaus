import { Note, ErrorBloc } from '@inseefr/wilco';
import {
	HTMLUtils,
	CreationUpdateItems,
	PublicationFemale,
	useTitle,
	ConfirmationDelete,
	Row,
} from 'js/utils';
import D, { D1, D2 } from '../../i18n/build-dictionary';

import './view.scss';
import { CodesCollapsiblePanel } from './codes-panel';
import { ViewMenu } from './menu';
import { ContributorsVisualisation } from '../../../../utils/contributors/contributors';
import { DisseminationStatusVisualisation } from '../../../../utils/dissemination-status/disseminationStatus';

export const CodeListDetailView = ({
	codelist,
	handleUpdate,
	handleBack,
	handleDelete,
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
	useTitle(D.codelistsTitle, codelist?.labelLg1);

	const descriptionLg1 = HTMLUtils.renderMarkdownElement(
		codelist.descriptionLg1
	);
	const descriptionLg2 = HTMLUtils.renderMarkdownElement(
		codelist.descriptionLg2
	);

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
			<ViewMenu
				handleUpdate={handleUpdate}
				col={col}
				handleDelete={handleDelete}
				handleBack={handleBack}
				updatable={updatable}
				publish={publish}
				codelist={codelist}
				deletable={deletable}
			></ViewMenu>

			<ErrorBloc error={serverSideError} />
			{
				<Row>
					<Note
						text={
							<ul>
								<li>
									{D.idTitle} : {codelist.id}
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
			<CodesCollapsiblePanel
				codelist={codelist}
				hidden={hidden}
				editable={false}
			/>
		</>
	);
};
