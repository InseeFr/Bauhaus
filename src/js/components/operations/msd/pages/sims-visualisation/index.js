import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { stringToDate } from 'js/utils/moment';
import { rangeType } from 'js/utils/msd/';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import Button from 'js/components/shared/button';
import { markdownToHtml } from 'js/utils/html';
import { Note } from 'js/components/shared/note';

const { RICH_TEXT, TEXT, DATE, CODE_LIST } = rangeType;

function hasLabelLg2(section) {
	return section.rangeType === TEXT || section.rangeType === RICH_TEXT;
}
export default function SimsVisualisation({
	metadataStructure,
	currentSection,
	codesLists,
	sims = {},
	secondLang,
	saveSecondLang,
	idOperation,
	goBack,
	langs: { lg1, lg2 },
}) {
	const shouldDisplayDuplicateButton = sims.operationsWithoutSims.length > 0;

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
						<div
							dangerouslySetInnerHTML={{
								__html: markdownToHtml(
									currentSection[isSecondLang ? 'labelLg2' : 'labelLg1']
								),
							}}
						/>
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
							{msd.idMas} - {msd.masLabelLg1}
						</h3>
					)}
					{!msd.isPresentational && (
						<Note
							context="operations"
							title={`${msd.idMas} - ${msd.masLabelLg1}`}
							text={displayInformation(msd, false, sims.rubrics[msd.idMas])}
							alone={!(hasLabelLg2(msd) && secondLang)}
							lang={lg1}
						/>
					)}
					{!msd.isPresentational && hasLabelLg2(msd) && secondLang && (
						<Note
							context="operations"
							title={`${msd.idMas} - ${msd.masLabelLg2} `}
							text={displayInformation(msd, true, sims.rubrics[msd.idMas])}
							lang={lg2}
						/>
					)}
				</div>
				{Object.values(msd.children).length > 0 &&
					Object.values(msd.children).map(child => (
						<MSDInformations key={child.idMas} msd={child} />
					))}
			</>
		);
	}

	return (
		<>
			<div className="row btn-line">
				<Button
					col={3}
					action={() => goBack(`/operations/operation/${idOperation}`)}
					label={D.btnReturn}
					context="operations"
				/>
				<div className={`col-md-${shouldDisplayDuplicateButton ? 3 : 6}`} />
				{shouldDisplayDuplicateButton && (
					<Button
						col={3}
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
						context="operations"
					/>
				)}
				<Button
					col={3}
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
