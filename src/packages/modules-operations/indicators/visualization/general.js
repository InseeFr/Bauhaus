import { Note } from '@inseefr/wilco';
import { D1, D2 } from '../../../deprecated-locales';
import { getSeeAlsoByType } from '../../shared/links/utils';
import DisplayLinks from '../../../modules-operations/shared/links/';
import SeeAlso from '../../../modules-operations/shared/seeAlso';
import { CreationUpdateItems } from '../../../components';
import PublishersView from '../../../modules-operations/components/publishers-view';
import CreatorsView from '../../../modules-operations/components/creators-view';
import D from '../../../deprecated-locales/build-dictionary';
import { PublicationMale, Row } from '../../../components';
import { renderMarkdownElement } from '../../../utils/html-utils';
import { useTitle } from '../../../utils/hooks/useTitle';

function DisplayMultiLangNote({
	value1,
	value2,
	title,
	langs: { lg1, lg2 },
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
				lang={lg1}
				alone={!secondLang}
				allowEmpty={true}
			/>
			{secondLang && (
				<Note
					text={body2}
					title={D2[title]}
					lang={lg2}
					alone={false}
					allowEmpty={true}
				/>
			)}
		</Row>
	);
}

function OperationsIndicatorVisualization({
	attr,
	langs,
	secondLang,
	frequency = {},
	organisations = [],
}) {
	useTitle(D.indicatorsTitle, attr?.prefLabelLg1);

	const seeAlso = getSeeAlsoByType(attr.seeAlso);

	const contributors = (attr.contributors || []).map(
		(d) => organisations.find((orga) => orga.id === d.id) || {}
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
				title={'altLabel'}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayMultiLangNote
				value1={attr.abstractLg1}
				value2={attr.abstractLg2}
				title={'summary'}
				langs={langs}
				secondLang={secondLang}
				md
			/>
			<DisplayMultiLangNote
				value1={attr.historyNoteLg1}
				value2={attr.historyNoteLg2}
				title={'history'}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayMultiLangNote
				value1={frequency.labelLg1}
				value2={frequency.labelLg2}
				title={'indicatorDataCollectFrequency'}
				langs={langs}
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
				title={'stakeholders'}
				langs={langs}
				secondLang={false}
				displayLink={false}
				labelLg1="label"
			/>

			<DisplayLinks
				links={attr.replaces}
				path={'/operations/indicator/'}
				title={'replaces'}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={attr.isReplacedBy}
				path={'/operations/indicator/'}
				title={'replacedBy'}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={attr.wasGeneratedBy}
				path={'/operations/series/'}
				title={'generatedBy'}
				langs={langs}
				secondLang={secondLang}
			/>

			<SeeAlso links={seeAlso} langs={langs} secondLang={secondLang} />
		</>
	);
}

export default OperationsIndicatorVisualization;
