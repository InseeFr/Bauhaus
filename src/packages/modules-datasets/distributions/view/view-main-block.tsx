import { Row } from '@components/layout';
import { Note } from '@components/note';
import { PublicationFemale } from '@components/status';

import { stringToDate } from '@utils/date-utils';
import { useSecondLang } from '@utils/hooks/second-lang';
import { renderMarkdownElement } from '@utils/html-utils';

import D, { D1, D2 } from '../../../deprecated-locales/build-dictionary';
import { Distribution } from '../../../model/Dataset';

export const ViewMainBlock = ({
	distribution,
}: Readonly<{ distribution: Distribution }>) => {
	const [secondLang] = useSecondLang();

	return (
		<>
			<Row>
				<Note
					text={
						<ul>
							<li>
								{D.createdDateTitle} : {stringToDate(distribution.created)}{' '}
							</li>
							<li>
								{D.modifiedDateTitle} : {stringToDate(distribution.updated)}{' '}
							</li>
							<li>
								{D.distributionStatus} :
								<PublicationFemale object={distribution} />
							</li>
							<li>
								{D.formatTitle} : {distribution.format}{' '}
							</li>
							<li>
								{D.tailleTitle} : {distribution.byteSize}{' '}
							</li>
							<li>
								{D.downloadUrlTitle} :{' '}
								<a
									target="_blank"
									rel="noreferrer noopener"
									href={distribution.url}
								>
									{distribution.url}{' '}
								</a>
							</li>
						</ul>
					}
					title={D1.globalInformationsTitle}
					alone={true}
				/>
			</Row>
			<Row>
				<Note
					text={renderMarkdownElement(distribution.descriptionLg1)}
					title={D1.descriptionTitle}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(distribution.descriptionLg1)}
						title={D2.descriptionTitle}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
		</>
	);
};
