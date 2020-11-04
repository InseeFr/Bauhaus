import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { rangeType } from 'js/utils/msd/';
import {
	Button,
	DuplicateButton,
	ErrorBloc,
	Note,
	ActionToolbar,
	ReturnButton,
	Panel,
	ExportButton,
} from '@inseefr/wilco';

import { PublicationFemale } from 'js/applications/operations/shared/status';

import {
	Auth,
	HTMLUtils,
	ValidationButton,
	CheckSecondLang,
} from 'bauhaus-utilities';
import {
	hasLabelLg2,
	shouldDisplayDuplicateButton,
	getParentUri,
} from 'js/applications/operations/msd/utils';

import SimsBlock from './sims-block';
import './sims-visualisation.scss';
const { RICH_TEXT } = rangeType;

export default function SimsVisualisation({
	metadataStructure,
	currentSection,
	codesLists,
	sims = {},
	secondLang,
	goBack,
	organisations,
	publishSims,
	exportCallback,
}) {
	const shouldDisplayDuplicateButtonFlag = shouldDisplayDuplicateButton(sims);

	function MSDInformations({ msd, firstLevel = false }) {
		return (
			<>
				{firstLevel && shouldDisplayTitleForPrimaryItem(msd) && (
					<h3 className="col-md-12 sims-title">
						{msd.idMas} - {msd.masLabelBasedOnCurrentLang}
					</h3>
				)}
				<div className="sims-row" key={msd.idMas} id={msd.idMas}>
					{!msd.isPresentational && (
						<Panel title={`${msd.idMas} - ${msd.masLabelLg1}`}>
							<SimsBlock
								msd={msd}
								isSecondLang={false}
								currentSection={sims.rubrics[msd.idMas]}
								unbounded={msd.maxOccurs === 'unbounded'}
								codesLists={codesLists}
								organisations={organisations}
							/>
						</Panel>
					)}
					{!msd.isPresentational && hasLabelLg2(msd) && secondLang && (
						<Panel title={`${msd.idMas} - ${msd.masLabelLg2}`}>
							<SimsBlock
								msd={msd}
								isSecondLang={true}
								currentSection={sims.rubrics[msd.idMas]}
								unbounded={msd.maxOccurs === 'unbounded'}
								codesLists={codesLists}
								organisations={organisations}
							/>
						</Panel>
					)}
				</div>
				{Object.values(msd.children).map((child) => (
					<MSDInformations key={child.idMas} msd={child} />
				))}
			</>
		);
	}

	/*
	 * The publication button should be enabled only if RICH_TEXT value do not
	 * have unsupported styles like STRIKETHROUGH, color or background color
	 */
	const publicationDisabled = HTMLUtils.containUnsupportedStyles(
		Object.keys(sims.rubrics)
			.filter((key) => sims.rubrics[key].rangeType === RICH_TEXT)
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
		(object) => {
			publishSims(object, (err) => {
				if (err) {
					setServerSideError(err);
				}
			});
		},
		[publishSims]
	);

	const CONTRIBUTOR = sims.idIndicator
		? Auth.INDICATOR_CONTRIBUTOR
		: Auth.SERIES_CONTRIBUTOR;
	return (
		<>
			<ActionToolbar>
				<ReturnButton action={() => goBack(getParentUri(sims))} />
				<Auth.AuthGuard
					roles={[Auth.ADMIN, CONTRIBUTOR]}
					complementaryCheck={shouldDisplayDuplicateButtonFlag}
				>
					<DuplicateButton
						action={`/operations/sims/${sims.id}/duplicate`}
						col={3}
					/>
				</Auth.AuthGuard>
				<Auth.AuthGuard roles={[Auth.ADMIN, CONTRIBUTOR]}>
					<ValidationButton
						object={sims}
						callback={(object) => publish(object)}
						disabled={publicationDisabled}
					/>
				</Auth.AuthGuard>
				<Auth.AuthGuard
					roles={[
						Auth.ADMIN,
						Auth.CNIS,
						Auth.INDICATOR_CONTRIBUTOR,
						Auth.SERIES_CONTRIBUTOR,
					]}
				>
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
				</Auth.AuthGuard>
				<ExportButton action={() => exportCallback(sims.id)} />
			</ActionToolbar>

			<ErrorBloc error={serverSideError} />

			<CheckSecondLang />

			<div className="row">
				<Note
					text={
						<ul>
							<li>
								{D.simsStatus} : <PublicationFemale object={sims} />
							</li>
						</ul>
					}
					title={D.globalInformationsTitle}
					alone={true}
				/>
			</div>

			{Object.values(metadataStructure).map((msd) => {
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
