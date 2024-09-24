import HelpInformation from '../../../../modules-operations/msd/help-information';
import { Note } from '../../../../components/note';
import { useParams } from 'react-router-dom';

export default function MSDHelp({
	metadataStructure,
	codesLists,
	organisations,
}) {
	const { idSection } = useParams();
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
		if (idSection && msd.idMas !== idSection) {
			return null;
		}
		return <MSDInformations key={msd.idMas} msd={msd} />;
	});
}
