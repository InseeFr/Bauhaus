import { useState } from 'react';
import { PageSubtitle } from '@inseefr/wilco';
import { PageTitle, Loading, CheckSecondLang } from '../../../components';

import CollectionVisualizationControls from './controls';
import CollectionGeneral from './general';
import CollectionMembers from '../../../modules-concepts/collections/visualisation/members';
import D from '../../../deprecated-locales';
import { useTitle } from '../../../utils/hooks/useTitle';
import { useCollectionExporter } from '../../../utils/hooks/collections';

const CollectionVisualization = ({
	id,
	permission,
	general,
	members,
	secondLang,
	langs,
	validateCollection,
}) => {
	useTitle(D.collectionsTitle, general.prefLabelLg1);

	const { isValidated, creator } = general;
	const { mutate: exportCollection, isPending: isExporting } =
		useCollectionExporter();
	const handleClickValid = () => {
		validateCollection(id);
	};

	if (isExporting) return <Loading textType="exporting" />;

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
				<CollectionGeneral
					attr={general}
					secondLang={secondLang}
					langs={langs}
				/>
				<CollectionMembers members={members} secondLang={secondLang} />
			</div>
		</div>
	);
};

export default CollectionVisualization;
