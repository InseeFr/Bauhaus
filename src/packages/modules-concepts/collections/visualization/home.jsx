import { CheckSecondLang } from '@components/check-second-lang';
import { Exporting, Loading } from '@components/loading';
import { PageTitle } from '@components/page-title';

import { PageSubtitle } from '../../../components/page-sub-title';
import D from '../../../deprecated-locales';
import CollectionMembers from '../../../modules-concepts/collections/visualisation/members';
import { useCollectionExporter } from '../../../utils/hooks/collections';
import { useTitle } from '../../../utils/hooks/useTitle';
import CollectionVisualizationControls from './controls';
import CollectionGeneral from './general';

const CollectionVisualization = ({
	id,
	permission,
	general,
	members,
	secondLang,
	validateCollection,
}) => {
	useTitle(D.collectionsTitle, general.prefLabelLg1);

	const { isValidated, creator } = general;
	const { mutate: exportCollection, isPending: isExporting } =
		useCollectionExporter();
	const handleClickValid = () => {
		validateCollection(id);
	};

	if (isExporting) return <Exporting />;

	return (
		<div>
			<div className="container">
				<PageTitle title={general.prefLabelLg1} />
				{secondLang && general.prefLabelLg2 && (
					<PageSubtitle subTitle={general.prefLabelLg2} />
				)}
				<CollectionVisualizationControls
					id={id}
					permission={permission}
					creator={creator}
					isValidated={isValidated === 'true'}
					handleValidation={handleClickValid}
					exportCollection={exportCollection}
				/>
				<CheckSecondLang />
				<CollectionGeneral attr={general} secondLang={secondLang} />
				<CollectionMembers members={members} secondLang={secondLang} />
			</div>
		</div>
	);
};

export default CollectionVisualization;
