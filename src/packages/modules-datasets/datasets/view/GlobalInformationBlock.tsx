import D, { D1 } from '../../../deprecated-locales/build-dictionary';
import { stringToDate } from '../../../utils/date-utils';
import {
	ConditionalDisplay,
	Organization,
	Organizations,
	Row,
} from '../../../components';
import {
	CL_ACCESS_RIGHTS,
	CL_CONF_STATUS,
	CL_FREQ,
} from '../../../redux/actions/constants/codeList';
import { WasGeneratedByBlock } from './wasGeneratedByBlock';
import { Dataset } from '../../../model/Dataset';
import { useThemes } from '../useThemes';
import { useCodesList } from '../../../utils/hooks/codeslist';
import { useOrganizations } from '../../../utils/hooks/organizations';
import { CodeDisplay } from '../../../components/code-display';
import { List } from '../../../components/list';
import { D as DatasetDictionary, lg1, lg2 } from '../../i18n';
import { Note } from '../../../components/note';

type GlobalInformationBlockTypes = {
	dataset: Dataset;
};

export const GlobalInformationBlock = ({
	dataset,
}: Readonly<GlobalInformationBlockTypes>) => {
	const { data: themesOptions = [] } = useThemes();
	const { data: organisations } = useOrganizations();

	const clAccessRights = useCodesList(CL_ACCESS_RIGHTS);
	const clFreq = useCodesList(CL_FREQ);
	const clConfStatus = useCodesList(CL_CONF_STATUS);

	if (!organisations) {
		return null;
	}

	return (
		<Row>
			<Note
				text={
					<ul>
						<li>
							{D.createdDateTitle} :{' '}
							{stringToDate(dataset.catalogRecord?.created)}{' '}
						</li>
						<li>
							{D.modifiedDateTitle} :{' '}
							{stringToDate(dataset.catalogRecord?.updated)}{' '}
						</li>
						<ConditionalDisplay data={dataset?.issued}>
							<li>
								{D.datasetsFirstDiffusion} : {stringToDate(dataset?.issued!)}{' '}
							</li>
						</ConditionalDisplay>

						{dataset.accessRights && (
							<li>
								{D.datasetsAccessRights} :{' '}
								<CodeDisplay
									codesList={clAccessRights}
									value={dataset.accessRights}
								></CodeDisplay>
							</li>
						)}
						{dataset.accrualPeriodicity && (
							<li>
								{D.datasetsUpdateFrequency} :{' '}
								<CodeDisplay
									codesList={clFreq}
									value={dataset.accrualPeriodicity}
								/>
							</li>
						)}
						{dataset.confidentialityStatus && (
							<li>
								{D.datasetsConfidentialityStatus} :{' '}
								<CodeDisplay
									codesList={clConfStatus}
									value={dataset.confidentialityStatus}
								></CodeDisplay>
							</li>
						)}
						<ConditionalDisplay data={dataset.creators}>
							<li>
								{D.datasetsDataProvider} :
								<Organizations
									creators={dataset.creators!}
									organizations={organisations}
								/>
							</li>
						</ConditionalDisplay>

						{dataset.publisher && (
							<li>
								{D.datasetsPublicationProvider} :{' '}
								<Organization
									creator={dataset.publisher}
									organizations={organisations}
								/>
							</li>
						)}
						<li>
							{D.generatedBy} :{' '}
							<WasGeneratedByBlock
								iris={dataset.wasGeneratedIRIs}
							></WasGeneratedByBlock>
						</li>
						<ConditionalDisplay data={dataset.themes}>
							<li>
								{D.theme} :{' '}
								<List
									items={dataset.themes}
									getContent={(value) =>
										themesOptions?.find((t) => t.value === value)?.label ?? ''
									}
								></List>
							</li>
						</ConditionalDisplay>
						{dataset.keywords?.lg1?.length > 0 && (
							<li>
								{DatasetDictionary.datasets.keywords} ({lg1}):{' '}
								<List items={dataset.keywords.lg1}></List>
							</li>
						)}
						{dataset.keywords?.lg2?.length > 0 && (
							<li>
								{DatasetDictionary.datasets.keywords} ({lg2}):{' '}
								<List items={dataset.keywords.lg2}></List>
							</li>
						)}
					</ul>
				}
				title={D1.globalInformationsTitle}
				alone={true}
			/>
		</Row>
	);
};
