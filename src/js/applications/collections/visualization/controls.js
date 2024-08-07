import { useState } from 'react';
import { ActionToolbar, Button } from '@inseefr/wilco';
import check from '../../../utils/auth';
import D from '../../../i18n';
import { CollectionExportModal } from '../modal';
import { useSelector } from 'react-redux';
import { Auth } from '../../../utils';
import { saveFileFromHttpResponse } from '../../../new-architecture/utils/files';
import { CollectionApi } from '../../../new-architecture/sdk/collection-api';

const CollectionVisualizationControls = ({
	isValidated,
	creator: collectionCreator,
	id,
	handleValidation,
	setExporting,
}) => {
	const { authType, roles, stamp } = useSelector((state) =>
		Auth.getPermission(state)
	);

	const [displayModal, setDisplayModal] = useState(false);

	const authImpl = check(authType);
	const admin = authImpl.isAdmin(roles);
	const contributor = authImpl.isContributor(roles, stamp, collectionCreator);
	const creator = authImpl.isCollectionCreator(roles, stamp, collectionCreator);

	const exportConcept = [() => setDisplayModal(true), D.btnExporter];
	const cancel = [`/collections`, D.btnReturn];
	const validate = [handleValidation, D.btnValid];
	const update = [`/collection/${id}/modify`, D.btnUpdate];

	const btns = [cancel, exportConcept];
	if (admin || creator) {
		btns.push(update);

		if (!isValidated) {
			btns.push(validate);
		}
	} else if (contributor) {
		btns.push(update);
	}

	const handleExportCollectionList = (type) => {
		return (ids, MimeType, lang = 'lg1', withConcepts) => {
			setExporting(true);
			const promise = CollectionApi.getCollectionExportByType(
				ids[0],
				MimeType,
				type,
				lang,
				withConcepts
			);

			return promise
				.then(saveFileFromHttpResponse)
				.finally(() => setExporting(false));
		};
	};

	return (
		<>
			{displayModal && (
				<CollectionExportModal
					ids={[id]}
					exportOds={handleExportCollectionList('ods')}
					exportOdt={handleExportCollectionList('odt')}
					close={() => setDisplayModal(false)}
				></CollectionExportModal>
			)}
			<ActionToolbar>
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
