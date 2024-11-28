import { ActionToolbar } from '@components/action-toolbar';
import { Button } from '@components/buttons/button';
import {
	PublishButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';

import check from '../../../auth/auth';
import { usePermission } from '../../../redux/hooks/usePermission';
import ExportButtons from '../export-buttons';

const CollectionVisualizationControls = ({
	isValidated,
	creator: collectionCreator,
	id,
	handleValidation,
	exportCollection,
}) => {
	const { authType, roles, stamp } = usePermission();

	const authImpl = check(authType);
	const admin = authImpl.isAdmin(roles);
	const contributor = authImpl.isContributor(roles, stamp, collectionCreator);
	const creator = authImpl.isCollectionCreator(roles, stamp, collectionCreator);

	const validate = <PublishButton action={handleValidation} />;
	const update = <UpdateButton action={`/concepts/collections/${id}/modify`} />;

	const btns = [];
	if (admin || creator) {
		btns.push(update);

		if (!isValidated) {
			btns.push(validate);
		}
	} else if (contributor) {
		btns.push(update);
	}

	return (
		<ActionToolbar>
			<ReturnButton action="/concepts/collections" />
			<ExportButtons
				ids={[id]}
				exportHandler={(type, withConcepts, lang = 'lg1') =>
					exportCollection({ ids: [id], type, withConcepts, lang })
				}
			/>

			{btns.map((btn) => {
				if (!btn) return null;
				if (!Array.isArray(btn)) {
					return btn;
				}
				const [action, label] = btn;
				return <Button key={label} action={action} label={label} />;
			})}
		</ActionToolbar>
	);
};

export default CollectionVisualizationControls;
