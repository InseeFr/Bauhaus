import { CreationUpdateItems } from '@components/creation-update-items';
import { Row } from '@components/layout';
import { Note } from '@components/note';
import { PublicationMale } from '@components/status';

import { useOrganizations } from '@utils/hooks/organizations';
import { useTitle } from '@utils/hooks/useTitle';
import { renderMarkdownElement } from '@utils/html-utils';

import { D1, D2 } from '../../../deprecated-locales';
import D from '../../../deprecated-locales/build-dictionary';
import DisplayLinks from '../../components/links';
import { getSeeAlsoByType } from '../../components/links/utils';
import PublishersView from '../../components/publishers-view';
import SeeAlso from '../../components/seeAlso';
import { CreatorsView } from '@components/business/creators-view';

function DisplayMultiLangNote({
	value1,
	value2,
	title,
	secondLang,
	md = false,
}) {
	const body1 = md ? renderMarkdownElement(value1) : value1;

	const body2 = md ? renderMarkdownElement(value2) : value2;

	return (
		<Row>
			<Note
				text={body1}
				title={D1[title]}
				alone={!secondLang}
				allowEmpty={true}
			/>
			{secondLang && (
				<Note text={body2} title={D2[title]} alone={false} allowEmpty={true} />
			)}
		</Row>
	);
}

function OperationsIndicatorVisualization({
	attr,
	secondLang,
	frequency = {},
}) {
	useTitle(D.indicatorsTitle, attr?.prefLabelLg1);

	const { data: organisations } = useOrganizations();
	const seeAlso = getSeeAlsoByType(attr.seeAlso);

	const contributors = (attr.contributors || []).map(
		(d) => organisations.find((orga) => orga.id === d.id) || {},
	);

	return (
		<>
			<Row>
				<Note
					text={
						<ul>
							<CreationUpdateItems
								creation={attr.created}
								update={attr.modified}
							/>
							<li>
								{D1.indicatorStatus} : <PublicationMale object={attr} />
							</li>
						</ul>
					}
					title={D1.globalInformationsTitle}
					alone={true}
				/>
			</Row>
			<DisplayMultiLangNote
				value1={attr.altLabelLg1}
				value2={attr.altLabelLg2}
				title="altLabel"
				secondLang={secondLang}
			/>
			<DisplayMultiLangNote
				value1={attr.abstractLg1}
				value2={attr.abstractLg2}
				title="summary"
				secondLang={secondLang}
				md
			/>
			<DisplayMultiLangNote
				value1={attr.historyNoteLg1}
				value2={attr.historyNoteLg2}
				title="history"
				secondLang={secondLang}
			/>
			<DisplayMultiLangNote
				value1={frequency.labelLg1}
				value2={frequency.labelLg2}
				title="indicatorDataCollectFrequency"
				secondLang={secondLang}
			/>
			<Row>
				<PublishersView publishers={attr.publishers} />
			</Row>
			<Row>
				<CreatorsView creators={attr.creators} />
			</Row>
			<DisplayLinks
				links={contributors}
				title="stakeholders"
				secondLang={false}
				displayLink={false}
				labelLg1="label"
			/>

			<DisplayLinks
				links={attr.replaces}
				path="/operations/indicator/"
				title="replaces"
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={attr.isReplacedBy}
				path="/operations/indicator/"
				title="replacedByMasc"
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={attr.wasGeneratedBy}
				path="/operations/series/"
				title="generatedBy"
				secondLang={secondLang}
			/>

			<SeeAlso links={seeAlso} secondLang={secondLang} />
		</>
	);
}

export default OperationsIndicatorVisualization;
