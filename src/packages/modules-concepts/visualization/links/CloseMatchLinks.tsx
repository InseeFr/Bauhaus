import { ExternalLink } from '@components/link';

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
							<ExternalLink href={cm.urn}>{cm.urn}</ExternalLink>
						</li>
					))}
				</ul>
			</li>
		)
	);
};
