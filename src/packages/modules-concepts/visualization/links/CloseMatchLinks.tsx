import { Link as LinkType } from '../../../model/concepts/concept';

export const CloseMatchLinks = ({
	links,
	Dictionnary,
}: Readonly<{ links: LinkType[]; Dictionnary: Record<string, string> }>) => {
	return (
		links.length > 0 && (
			<li>
				{Dictionnary.equivalentTitle} :
				<ul>
					{links.map((cm) => (
						<li key={cm.urn}>
							<a href={cm.urn} target="_blank" rel="noopener noreferrer">
								{cm.urn}
							</a>
						</li>
					))}
				</ul>
			</li>
		)
	);
};
