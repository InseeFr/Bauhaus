import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { stringToDate } from 'js/utils/moment';
import { rangeType } from 'js/utils/msd/';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import Button from 'js/components/shared/button';
import { markdownToHtml } from 'js/utils/html';
import { Note } from 'js/components/shared/note/note';
import DocumentsBloc from 'js/components/operations/msd/documents/documents-bloc/index.js';
import {
	hasLabelLg2,
	shouldDisplayDuplicateButton,
	getParentUri,
} from 'js/components/operations/msd/utils';

const { RICH_TEXT, TEXT, DATE, CODE_LIST, ORGANIZATION } = rangeType;

export default function SimsVisualisation({
	metadataStructure,
	currentSection,
	codesLists,
	sims = {},
	secondLang,
	saveSecondLang,
	goBack,
	langs: { lg1, lg2 },
	organisations,
}) {
	const shouldDisplayDuplicateButtonFlag = shouldDisplayDuplicateButton(sims);

	function displayInformation(msd, isSecondLang = false, currentSection = {}) {
		if (!msd.masLabelLg1) {
			return null;
		}
		return (
			!msd.isPresentational && (
				<>
					{currentSection.rangeType === TEXT &&
						currentSection[isSecondLang ? 'labelLg2' : 'labelLg1']}
					{currentSection.value &&
						currentSection.rangeType === DATE &&
						stringToDate(currentSection.value)}
					{currentSection.rangeType === RICH_TEXT && (
						<>
							<div
								dangerouslySetInnerHTML={{
									__html: markdownToHtml(
										currentSection[isSecondLang ? 'labelLg2' : 'labelLg1']
									),
								}}
							/>
							<DocumentsBloc
								documents={currentSection.documents}
								localPrefix={isSecondLang ? 'Lg2' : 'Lg1'}
							/>
						</>
					)}
					{currentSection.rangeType === CODE_LIST &&
						codesLists[currentSection.codeList] && (
							<span>
								{currentSection.codeList}-
								{
									codesLists[currentSection.codeList].codes.find(
										code => code.code === currentSection.value
									).labelLg1
								}
							</span>
						)}
					{currentSection.rangeType === ORGANIZATION && (
						<span>
							{
								(
									organisations.find(
										orga => orga.id === currentSection.value
									) || {}
								).label
							}
						</span>
					)}
				</>
			)
		);
	}

	function MSDInformations({ msd, firstLevel = false }) {
		return (
			<>
				<div className="row flex" key={msd.idMas} id={msd.idMas}>
					{firstLevel && shouldDisplayTitleForPrimaryItem(msd) && (
						<h3 className="col-md-12">
							{msd.idMas} - {msd.masLabelBasedOnCurrentLang}
						</h3>
					)}
					{!msd.isPresentational && (
						<Note
							context="operations"
							title={`${msd.idMas} - ${msd.masLabelBasedOnCurrentLang}`}
							text={displayInformation(msd, false, sims.rubrics[msd.idMas])}
							alone={!(hasLabelLg2(msd) && secondLang)}
							lang={lg1}
							alt={`${msd.idMas} - ${msd.masLabelLg1}`}
						/>
					)}
					{!msd.isPresentational && hasLabelLg2(msd) && secondLang && (
						<Note
							context="operations"
							title={`${msd.idMas} - ${msd.masLabelBasedOnCurrentLang}`}
							text={displayInformation(msd, true, sims.rubrics[msd.idMas])}
							lang={lg2}
							alt={`${msd.idMas} - ${msd.masLabelLg2}`}
						/>
					)}
				</div>
				{Object.values(msd.children).map(child => (
					<MSDInformations key={child.idMas} msd={child} />
				))}
			</>
		);
	}

	return (
		<>
			<div className="row btn-line">
				<Button
					action={() => goBack(getParentUri(sims))}
					label={D.btnReturn}
					context="operations"
				/>
				<div className={`col-md-${shouldDisplayDuplicateButtonFlag ? 5 : 8}`} />
				{shouldDisplayDuplicateButtonFlag && (
					<Button
						action={`/operations/sims/${sims.id}/duplicate`}
						label={
							<>
								<span
									className="glyphicon glyphicon-duplicate"
									aria-hidden="true"
								/>
								<span> {D.btnDuplicate}</span>
							</>
						}
						col={3}
						context="operations"
					/>
				)}
				<Button
					action={`/operations/sims/${sims.id}/modify`}
					label={
						<>
							<span
								className="glyphicon glyphicon-floppy-disk"
								aria-hidden="true"
							/>
							<span> {D.btnUpdate}</span>
						</>
					}
					context="operations"
				/>
			</div>
			<CheckSecondLang secondLang={secondLang} onChange={saveSecondLang} />

			{Object.values(metadataStructure).map(msd => {
				if (currentSection && msd.idMas !== currentSection) {
					return null;
				}
				return <MSDInformations key={msd.idMas} msd={msd} firstLevel={true} />;
			})}
		</>
	);
}
function shouldDisplayTitleForPrimaryItem(msd) {
	return (
		msd.isPresentational ||
		(!msd.isPresentational && Object.keys(msd.children).length === 0)
	);
}
SimsVisualisation.propTypes = {
	metadataStructure: PropTypes.object.isRequired,
	currentSection: PropTypes.string,
	codesLists: PropTypes.object.isRequired,
	sims: PropTypes.object.isRequired,
	goBack: PropTypes.func,
};
