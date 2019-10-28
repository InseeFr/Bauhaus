import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { stringToDate } from 'js/utils/moment';
import { rangeType } from 'js/utils/msd/';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import { Button } from 'bauhaus-library';
import { markdownToHtml, containUnsupportedStyles } from 'js/utils/html';
import Note from 'js/components/shared/note';
import DocumentsBloc from 'js/components/operations/msd/documents/documents-bloc/index.js';
import {
	hasLabelLg2,
	shouldDisplayDuplicateButton,
	getParentUri,
} from 'js/components/operations/msd/utils';
import { isLink, isDocument } from 'js/components/operations/document/utils';
import {
	ADMIN,
	SERIES_CREATOR,
	INDICATOR_CREATOR,
	CNIS,
} from 'js/utils/auth/roles';
import Auth from 'js/utils/auth/components/auth';
import { DuplicateButton } from 'bauhaus-library';
import ValidationButton from 'js/components/operations/shared/validationButton';
import { ErrorBloc } from 'bauhaus-library';

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
	publishSims,
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
							{currentSection.documents && (
								<>
									<DocumentsBloc
										documents={currentSection.documents.filter(isDocument)}
										localPrefix={isSecondLang ? 'Lg2' : 'Lg1'}
										objectType="documents"
									/>
									<DocumentsBloc
										documents={currentSection.documents.filter(isLink)}
										localPrefix={isSecondLang ? 'Lg2' : 'Lg1'}
										objectType="links"
									/>
								</>
							)}
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
				{firstLevel && shouldDisplayTitleForPrimaryItem(msd) && (
					<h3 className="col-md-12 sims-title">
						{msd.idMas} - {msd.masLabelBasedOnCurrentLang}
					</h3>
				)}
				<div className="row flex" key={msd.idMas} id={msd.idMas}>
					{!msd.isPresentational && (
						<Note
							title={`${msd.idMas} - ${msd.masLabelBasedOnCurrentLang}`}
							text={displayInformation(msd, false, sims.rubrics[msd.idMas])}
							alone={!(hasLabelLg2(msd) && secondLang)}
							lang={lg1}
							alt={`${msd.idMas} - ${msd.masLabelLg1}`}
						/>
					)}
					{!msd.isPresentational && hasLabelLg2(msd) && secondLang && (
						<Note
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

	/*
	 * The publication button should be enabled only if RICH_TEXT value do not
	 * have unsupported styles like STRIKETHROUGH, color or background color
	 */
	const publicationDisabled = containUnsupportedStyles(
		Object.keys(sims.rubrics)
			.filter(key => sims.rubrics[key].rangeType === RICH_TEXT)
			.reduce((acc, key) => {
				return {
					...acc,
					[`${key}_labelLg1`]: sims.rubrics[key].labelLg1,
					[`${key}_labelLg2`]: sims.rubrics[key].labelLg2,
				};
			}, {})
	);

	const [serverSideError, setServerSideError] = useState();
	const publish = useCallback(
		object => {
			publishSims(object, err => {
				if (err) {
					setServerSideError(err);
				}
			});
		},
		[publishSims]
	);

	return (
		<>
			<div className="row btn-line action-toolbar">
				<Button action={() => goBack(getParentUri(sims))} label={D.btnReturn} />
				<ErrorBloc error={serverSideError} />
				<Auth
					roles={[ADMIN, SERIES_CREATOR]}
					complementaryCheck={shouldDisplayDuplicateButtonFlag}
				>
					<DuplicateButton
						action={`/operations/sims/${sims.id}/duplicate`}
						col={3}
					/>
				</Auth>
				<Auth
					roles={[
						ADMIN,
						!!sims.idIndicator ? SERIES_CREATOR : INDICATOR_CREATOR,
					]}
				>
					<ValidationButton
						object={sims}
						callback={object => publish(object)}
						disabled={publicationDisabled}
					/>
				</Auth>
				<Auth roles={[ADMIN, INDICATOR_CREATOR, SERIES_CREATOR, CNIS]}>
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
					/>
				</Auth>
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
