import HelpInformation from '../../../../modules-operations/msd/help-information';
import { Note } from '../../../../components/note';

export default function MSDHelp({
	metadataStructure,
	currentSection,
	codesLists,
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
