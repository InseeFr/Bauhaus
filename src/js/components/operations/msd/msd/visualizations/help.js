import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';

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
					{msd.rangeType === 'CODE_LIST' && codesLists[msd.codeList]
						? `${D[`help${msd.rangeType}`]} - ${
								codesLists[msd.codeList].codeListLabelLg1
						  }`
						: `${D[`help${msd.rangeType}`]}`}

					{msd.rangeType === 'CODE_LIST' &&
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
			<div>
				{Object.keys(children).map(id => {
					return (
						<div key={id} className="contenu">
							<article id={id} className="panel panel-default">
								<div className="panel-heading">
									<h3>{`${id} - ${children[id].masLabelLg1}`}</h3>
								</div>
								<div className="panel-body">
									{displayInformation(children[id], codesLists)}
								</div>
							</article>
							{displayContent(children[id].children, codesLists)}
						</div>
					);
				})}
			</div>
		);
	}
	return Object.keys(metadataStructure).map(id => {
		if (currentSection && id !== currentSection) {
			return null;
		}
		return (
			<div key={id}>
				<div className="panel panel-default">
					<div className="panel-heading">
						<h2 id={id} className="titre-principal">
							{id} - {metadataStructure[id].masLabelLg1}
						</h2>
					</div>
					<div className="panel-body">
						{displayInformation(metadataStructure[id], codesLists)}
					</div>
				</div>
				{displayContent(metadataStructure[id].children, codesLists)}
			</div>
		);
	});
}

MSDHelp.propTypes = {
	metadataStructure: PropTypes.object.isRequired,
	currentSection: PropTypes.string,
	codesLists: PropTypes.object.isRequired,
};
