import { D1, D2 } from '../../../deprecated-locales';
import RelationsView from '../../../modules-operations/shared/relations';
import DisplayLinks from '../../../modules-operations/shared/links/';
import SeeAlso from '../../../modules-operations/shared/seeAlso';
import { getSeeAlsoByType } from '../../shared/links/utils';
import CreatorsView from '../../../modules-operations/components/creators-view';
import PublishersView from '../../../modules-operations/components/publishers-view';
import D from '../../../deprecated-locales/build-dictionary';
import {
	PublicationFemale,
	Row,
	CreationUpdateItems,
} from '../../../components';
import { renderMarkdownElement } from '../../../utils/html-utils';
import { useTitle } from '../../../utils/hooks/useTitle';
import { Note } from '../../../components/note';
function OperationsSerieVisualization({
	attr,
	langs: { lg1, lg2 },
	langs,
	secondLang,
	frequency = {},
	category = {},
	organisations = [],
}) {
	useTitle(D.seriesTitle + ' - ' + D.operationsTitle, attr?.prefLabelLg1);

	const seeAlso = getSeeAlsoByType(attr.seeAlso);

	const dataCollectors = (attr.dataCollectors || []).map(
		(d) => organisations.find((orga) => orga.id === d.id) || {}
	);
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
								{D1.seriesStatus} : <PublicationFemale object={attr} />
							</li>
						</ul>
					}
					title={D1.globalInformationsTitle}
					alone={true}
				/>
			</Row>
			<Row>
				<Note
					text={attr.altLabelLg1}
					title={D1.altLabel}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={attr.altLabelLg2}
						title={D2.altLabel}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={renderMarkdownElement(attr.abstractLg1)}
					title={D1.summary}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(attr.abstractLg2)}
						title={D2.summary}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>

			<Row>
				<Note
					text={renderMarkdownElement(attr.historyNoteLg1)}
					title={D1.history}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(attr.historyNoteLg2)}
						title={D2.history}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>

			<Row>
				<Note
					text={category.labelLg1}
					title={D1.operationType}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={category.labelLg2}
						title={D2.operationType}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>

			<Row>
				<Note
					text={frequency.labelLg1}
					title={D1.dataCollectFrequency}
					lang={lg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={frequency.labelLg2}
						title={D2.dataCollectFrequency}
						lang={lg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>

			<div id="publishers" className="row">
				<PublishersView publishers={attr.publishers} lg1={lg1} />
			</div>

			<DisplayLinks
				links={contributors}
				title={'stakeholders'}
				langs={langs}
				secondLang={false}
				displayLink={false}
				labelLg1="label"
			/>
			<DisplayLinks
				links={dataCollectors}
				title={'dataCollector'}
				langs={langs}
				secondLang={false}
				displayLink={false}
				labelLg1="label"
			/>

			<div id="creators" className="row">
				<CreatorsView creators={attr.creators} lg1={lg1} />
			</div>
			<DisplayLinks
				links={attr.replaces}
				path={'/operations/series/'}
				title={'replaces'}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={attr.isReplacedBy}
				path={'/operations/series/'}
				title={'replacedBy'}
				langs={langs}
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={attr.generate}
				path={'/operations/indicator/'}
				title={'indicators'}
				langs={langs}
				secondLang={secondLang}
			/>

			<SeeAlso links={seeAlso} langs={langs} secondLang={secondLang} />

			<RelationsView
				children={attr.operations}
				childrenTitle={'childrenOperations'}
				childrenPath="operation"
				parent={attr.family}
				parentTitle={'parentFamilly'}
				parentPath="family"
				title={'linksTitle'}
				langs={{ lg1, lg2 }}
				secondLang={secondLang}
			/>
		</>
	);
}

export default OperationsSerieVisualization;
