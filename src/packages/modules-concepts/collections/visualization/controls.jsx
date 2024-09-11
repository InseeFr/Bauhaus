import { ActionToolbar, Button } from '@inseefr/wilco';
import check from '../../../auth/auth';
import D from '../../../deprecated-locales';
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


	const validate = [handleValidation, D.btnValid];
	const update = [`/collection/${id}/modify`, D.btnUpdate];

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
		<>
			<ActionToolbar>
				<Button  action={`/collections`} label={D.btnReturn} />
				<ExportButtons
					ids={[id]}
					exportHandler={(type, withConcepts, lang = 'lg1') =>
						exportCollection({ ids: [id], type, withConcepts, lang })
					}
				/>

				{btns.map((btn) => {
					if (!btn) return null;
					const [action, label] = btn;
					return btn && <Button key={label} action={action} label={label} />;
				})}
			</ActionToolbar>
		</>
	);
};

export default CollectionVisualizationControls;
