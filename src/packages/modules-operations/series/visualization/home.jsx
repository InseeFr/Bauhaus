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
import { useOrganizations } from '../../../utils/hooks/organizations';
function OperationsSerieVisualization({
	attr,
	langs: { lg1 },
	secondLang,
	frequency = {},
	category = {},
}) {
	useTitle(D.seriesTitle + ' - ' + D.operationsTitle, attr?.prefLabelLg1);
	const { data: organisations } = useOrganizations();
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
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={attr.altLabelLg2}
						title={D2.altLabel}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>
			<Row>
				<Note
					text={renderMarkdownElement(attr.abstractLg1)}
					title={D1.summary}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(attr.abstractLg2)}
						title={D2.summary}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>

			<Row>
				<Note
					text={renderMarkdownElement(attr.historyNoteLg1)}
					title={D1.history}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={renderMarkdownElement(attr.historyNoteLg2)}
						title={D2.history}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>

			<Row>
				<Note
					text={category.labelLg1}
					title={D1.operationType}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={category.labelLg2}
						title={D2.operationType}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</Row>

			<Row>
				<Note
					text={frequency.labelLg1}
					title={D1.dataCollectFrequency}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						text={frequency.labelLg2}
						title={D2.dataCollectFrequency}
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
				title="stakeholders"
				secondLang={false}
				displayLink={false}
				labelLg1="label"
			/>
			<DisplayLinks
				links={dataCollectors}
				title="dataCollector"
				secondLang={false}
				displayLink={false}
				labelLg1="label"
			/>

			<div id="creators" className="row">
				<CreatorsView creators={attr.creators} />
			</div>
			<DisplayLinks
				links={attr.replaces}
				path="/operations/series/"
				title="replaces"
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={attr.isReplacedBy}
				path="/operations/series/"
				title="replacedBy"
				secondLang={secondLang}
			/>
			<DisplayLinks
				links={attr.generate}
				path="/operations/indicator/"
				title="indicators"
				secondLang={secondLang}
			/>

			<SeeAlso links={seeAlso} secondLang={secondLang} />

			<RelationsView
				children={attr.operations}
				childrenTitle="childrenOperations"
				childrenPath="operation"
				parent={attr.family}
				parentTitle="parentFamilly"
				parentPath="family"
				title="linksTitle"
				secondLang={secondLang}
			/>
		</>
	);
}

export default OperationsSerieVisualization;
