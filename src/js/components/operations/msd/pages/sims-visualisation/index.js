import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { stringToDate } from 'js/utils/moment';
import { rangeType } from 'js/utils/msd/';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import Button from 'js/components/shared/button';
import { markdownToHtml } from 'js/utils/html';
import MSDItemLayout from 'js/components/operations/msd/msd-item-layout';

const { REPORTED_ATTRIBUTE, TEXT, DATE, CODE_LIST } = rangeType;

function hasLabelLg2(section) {
	return section.rangeType === TEXT || section.rangeType === REPORTED_ATTRIBUTE;
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
}) {
	function displayInformation(msd, currentSection = {}) {
		if (!msd.masLabelLg1) {
			return null;
		}
		return (
			<dl>
				<dt>{D.labelTitle}:</dt>
				<dd>{msd.masLabelLg2}</dd>
				{!msd.isPresentational && (
					<React.Fragment>
						<dt>{D.simsValue}:</dt>
						<dd>
							{currentSection.rangeType === TEXT && currentSection.labelLg1}
							{currentSection.value &&
								currentSection.rangeType === DATE &&
								stringToDate(currentSection.value)}
							{currentSection.rangeType === REPORTED_ATTRIBUTE && (
								<div
									dangerouslySetInnerHTML={{
										__html: markdownToHtml(currentSection.labelLg1),
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
						</dd>
						{secondLang && hasLabelLg2(msd) && <dt>{D.altLabelTitle}:</dt>}
						{secondLang &&
							hasLabelLg2(msd) && (
								<dd>
									{currentSection.rangeType === TEXT && currentSection.labelLg1}

									{currentSection.rangeType === REPORTED_ATTRIBUTE && (
										<div
											dangerouslySetInnerHTML={{
												__html: markdownToHtml(currentSection.labelLg2),
											}}
										/>
									)}
								</dd>
							)}
					</React.Fragment>
				)}
			</dl>
		);
	}

	function displayContent(children = []) {
		if (Object.values(children).length <= 0) return null;
		return (
			<React.Fragment>
				{Object.values(children).map(child => {
					return (
						<React.Fragment key={child.idMas}>
							<MSDItemLayout
								id={child.idMas}
								title={`${child.idMas} - ${child.masLabelLg1}`}
							>
								{displayInformation(child, sims.rubrics[child.idMas])}
							</MSDItemLayout>
							{displayContent(child.children)}
						</React.Fragment>
					);
				})}
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			<div className="row btn-line">
				<Button
					col={3}
					action={() => goBack(`/operations/operation/${idOperation}`)}
					label={D.btnReturn}
					context="operations"
				/>
				<div className="col-md-6" />
				<Button
					col={3}
					action={`/operations/sims/${sims.id}/modify`}
					label={
						<React.Fragment>
							<span
								className="glyphicon glyphicon-floppy-disk"
								aria-hidden="true"
							/>
							<span> {D.btnUpdate}</span>
						</React.Fragment>
					}
					context="operations"
				/>
			</div>
			<CheckSecondLang secondLang={secondLang} onChange={saveSecondLang} />
			{Object.values(metadataStructure).map(msd => {
				if (currentSection && msd.idMas !== currentSection) {
					return null;
				}
				return (
					<div key={msd.idMas}>
						<article className="panel panel-default">
							<div className="panel-heading">
								<h2 id={msd.idMas} className="titre-principal">
									{msd.idMas} - {msd.masLabelLg1}
								</h2>
							</div>
							<div className="panel-body">
								{displayInformation(msd, sims.rubrics[msd.idMas])}
							</div>
						</article>
						{displayContent(msd.children, sims.rubrics[msd.idMas])}
					</div>
				);
			})}
		</React.Fragment>
	);
}

SimsVisualisation.propTypes = {
	metadataStructure: PropTypes.object.isRequired,
	currentSection: PropTypes.string,
	codesLists: PropTypes.object.isRequired,
	sims: PropTypes.object.isRequired,
	goBack: PropTypes.func,
};
