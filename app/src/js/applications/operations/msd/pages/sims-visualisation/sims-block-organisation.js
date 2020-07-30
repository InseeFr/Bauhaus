import React from 'react';

const SimsBlockOrganisation = ({ organisations, currentSection }) => {
	return (
		<span>
			{
				(organisations.find(orga => orga.id === currentSection.value) || {})
					.label
			}
		</span>
	);
};

export default SimsBlockOrganisation;
