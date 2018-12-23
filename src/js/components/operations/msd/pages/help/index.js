import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { rangeType } from 'js/utils/msd/';

const { CODE_LIST } = rangeType;

export default function MSDHelp({
	metadataStructure,
	currentSection,
	codesLists,
}) {
	function displayInformation(msd) {
		if (!msd.masLabelLg1) {
			return null;
		}
		return (
			<dl>
				<dt>{D.labelTitle}:</dt>
				<dd>{msd.masLabelLg2}</dd>
				<dt>{D.helpPresentational}:</dt>
				<dd>{msd.isPresentational.toString()}</dd>
				<dt>{D.helpRange}:</dt>
				<dd>
					{msd.rangeType === CODE_LIST && codesLists[msd.codeList]
						? `${D[`help${msd.rangeType}`]} - ${
								codesLists[msd.codeList].codeListLabelLg1
						  }`
						: `${D[`help${msd.rangeType}`]}`}

					{msd.rangeType === CODE_LIST &&
						codesLists[msd.codeList] && (
							<ul className="list-group">
								{codesLists[msd.codeList].codes.map(code => (
									<li className="list-group-item" key={code.code}>
										{code.labelLg1}
									</li>
								))}
							</ul>
						)}
				</dd>
			</dl>
		);
	}

	function displayContent(children) {
		if (Object.keys(children).length <= 0) return null;
		return (
			<React.Fragment>
				{Object.values(children).map(child => {
					return (
						<React.Fragment key={child.idMas}>
							<article id={child.idMas} className="panel panel-default contenu">
								<div className="panel-heading">
									<h3>{`${child.idMas} - ${child.masLabelLg1}`}</h3>
								</div>
								<div className="panel-body">{displayInformation(child)}</div>
							</article>
							{displayContent(child.children)}
						</React.Fragment>
					);
				})}
			</React.Fragment>
		);
	}

	return Object.values(metadataStructure).map(msd => {
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
					<div className="panel-body">{displayInformation(msd)}</div>
				</article>
				{displayContent(msd.children)}
			</div>
		);
	});
}

MSDHelp.propTypes = {
	metadataStructure: PropTypes.object.isRequired,
	currentSection: PropTypes.string,
	codesLists: PropTypes.object.isRequired,
};
