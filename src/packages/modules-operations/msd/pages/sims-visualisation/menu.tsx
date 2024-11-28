import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	DuplicateButton,
	ExportButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';

import Auth, { RoleCheck } from '../../../../auth/components/auth';
import {
	ADMIN,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
} from '../../../../auth/roles';
import { Sims } from '../../../../model/Sims';
import { useGoBack } from '../../../../utils/hooks/useGoBack';
import { getParentUri, shouldDisplayDuplicateButton } from '../../utils';

type MenuTypes = {
	sims: Sims;
	owners: string[];
	onExport: () => void;
	onDelete: () => void;
	onPublish: () => void;
};
export const Menu = ({
	sims,
	owners,
	onExport,
	onDelete,
	onPublish,
}: Readonly<MenuTypes>) => {
	const shouldDisplayDuplicateButtonFlag = shouldDisplayDuplicateButton(sims);
	const goBack = useGoBack();

	const checkStamp = (stamp: string) => owners.includes(stamp);

	const CREATOR: RoleCheck = !sims.idIndicator
		? [SERIES_CONTRIBUTOR, checkStamp]
		: [INDICATOR_CONTRIBUTOR, checkStamp];

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack(getParentUri(sims))} />
			<Auth
				roles={[ADMIN, CREATOR]}
				complementaryCheck={shouldDisplayDuplicateButtonFlag}
			>
				<DuplicateButton
					action={`/operations/sims/${sims.id}/duplicate`}
					col={3}
				/>
			</Auth>
			<Auth roles={[ADMIN]} complementaryCheck={!!sims.idSeries}>
				<DeleteButton action={onDelete} />
			</Auth>
			<Auth roles={[ADMIN, CREATOR]}>
				<ValidationButton
					object={sims}
					callback={() => onPublish()}
					disabled={false}
				/>
				<UpdateButton action={`/operations/sims/${sims.id}/modify`} />
			</Auth>
			<ExportButton action={onExport} />
		</ActionToolbar>
	);
};
