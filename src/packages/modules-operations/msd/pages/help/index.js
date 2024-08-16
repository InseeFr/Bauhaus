import HelpInformation from '../../../../modules-operations/msd/help-information';
import { Note } from '@inseefr/wilco';

export default function MSDHelp({
	metadataStructure,
	currentSection,
	codesLists,
	langs: { lg1 },
	organisations,
}) {
	function MSDInformations({ msd }) {
		return (
			<>
				<div className="row" key={msd.idMas} id={msd.idMas}>
					<Note
						title={`${msd.idMas} - ${msd.masLabelLg1}`}
						text={
							<HelpInformation
								msd={msd}
								codesLists={codesLists}
								organisations={organisations}
							/>
						}
						alone
						lang={lg1}
					/>
				</div>
				{Object.values(msd.children).map((child) => (
					<MSDInformations key={child.idMas} msd={child} />
				))}
			</>
		);
	}
	return Object.values(metadataStructure).map((msd) => {
		if (currentSection && msd.idMas !== currentSection) {
			return null;
		}
		return <MSDInformations key={msd.idMas} msd={msd} />;
	});
}
