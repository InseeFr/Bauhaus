import { PublishButton } from '@components/buttons/buttons-with-icons';
import { Picker } from '@components/picker-page';

import D from '../../../deprecated-locales';

const CollectionsToValidate = ({
	collections,
	handleValidateCollectionList,
}) => {
	return (
		<Picker
			items={collections}
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
