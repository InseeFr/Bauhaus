import { ActionToolbar } from '@components/action-toolbar';
import {
	PublishButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';

import { HasAccess } from '../../../auth/components/auth';
import ExportButtons from '../export-buttons';

const CollectionVisualizationControls = ({
	isValidated,
	id,
	handleValidation,
	exportCollection,
}) => {
	return (
		<ActionToolbar>
			<ReturnButton action="/concepts/collections" />
			<ExportButtons
				ids={[id]}
				exportHandler={(type, withConcepts, lang = 'lg1') =>
					exportCollection({ ids: [id], type, withConcepts, lang })
				}
			/>

			<HasAccess
				module="CONCEPT_COLLECTION"
				privilege="PUBLISH"
				complementaryCheck={!isValidated}
			>
				<PublishButton action={handleValidation} />
			</HasAccess>

			<HasAccess module="CONCEPT_COLLECTION" privilege="UPDATE">
				<UpdateButton action={`/concepts/collections/${id}/modify`} />
			</HasAccess>
		</ActionToolbar>
	);
};

export default CollectionVisualizationControls;
