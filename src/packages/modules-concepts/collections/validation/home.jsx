import { PublishButton } from '@components/buttons/buttons-with-icons';
import { Picker } from '@components/picker-page';

import check from '../../../auth/auth';
import D from '../../../deprecated-locales';

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
		stamp,
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
