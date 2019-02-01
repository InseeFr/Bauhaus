import React from 'react';
import PropTypes from 'prop-types';
import HelpInformation from 'js/components/operations/msd/help-information';
import { Note } from 'js/components/shared/note';

export default function MSDHelp({
	metadataStructure,
	currentSection,
	codesLists,
	langs: { lg1 },
}) {
	function MSDInformations({ msd }) {
		return (
			<React.Fragment>
				<div className="row" key={msd.idMas} id={msd.idMas}>
					<Note
						context="operations"
						title={`${msd.idMas} - ${msd.masLabelLg1}`}
						text={<HelpInformation msd={msd} codesLists={codesLists} />}
						alone
						lang={lg1}
					/>
				</div>
				{Object.values(msd.children).length > 0 &&
					Object.values(msd.children).map(child => (
						<MSDInformations key={child.idMas} msd={child} />
					))}
			</React.Fragment>
		);
	}
	return Object.values(metadataStructure).map(msd => {
		if (currentSection && msd.idMas !== currentSection) {
			return null;
		}
		return <MSDInformations key={msd.idMas} msd={msd} />;
	});
}

MSDHelp.propTypes = {
	metadataStructure: PropTypes.object.isRequired,
	currentSection: PropTypes.string,
	codesLists: PropTypes.object.isRequired,
};
