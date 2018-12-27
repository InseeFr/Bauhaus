import React from 'react';
import PropTypes from 'prop-types';
import HelpInformation from 'js/components/operations/msd/help-information';
import MSDItemLayout from 'js/components/operations/msd/msd-item-layout';

export default function MSDHelp({
	metadataStructure,
	currentSection,
	codesLists,
}) {
	function displayContent(children) {
		if (Object.keys(children).length <= 0) return null;
		return (
			<React.Fragment>
				{Object.values(children).map(child => {
					return (
						<React.Fragment key={child.idMas}>
							<MSDItemLayout
								id={child.idMas}
								title={`${child.idMas} - ${child.masLabelLg1}`}
							>
								<HelpInformation msd={child} codesLists={codesLists} />
							</MSDItemLayout>
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
					<div className="panel-body">
						<HelpInformation msd={msd} codesLists={codesLists} />
					</div>
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
