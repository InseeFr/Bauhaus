import Picker from '../../../applications/shared/picker-page';
import D from '../../../i18n';
import check from '../../../new-architecture/auth/auth';
import { PublishButton } from '@inseefr/wilco';

const CollectionsToValidate = ({
	collections,
	permission,
	handleValidateCollectionList,
}) => {
	const { authType, roles, stamp } = permission;
	const authImpl = check(authType);

	const filteredCollections = authImpl.filterCollectionsToValidate(
		collections,
		roles,
		stamp
	);
	return (
		<Picker
			items={filteredCollections}
			title={D.collectionsToValidTitle}
			panelTitle={D.collectionsToValidPanelTitle}
			labelWarning={D.hasNotCollectionToValid}
			ValidationButton={PublishButton}
			handleAction={handleValidateCollectionList}
			context="collections"
		/>
	);
};

export default CollectionsToValidate;
