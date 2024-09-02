import {
	ActionToolbar,
	Button,
	DeleteButton,
	DuplicateButton,
	ExportButton,
	ReturnButton,
} from '@inseefr/wilco';
import { getParentUri, shouldDisplayDuplicateButton } from '../../utils';
import Auth, { RoleCheck } from '../../../../auth/components/auth';
import {
	ADMIN,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
} from '../../../../auth/roles';
import { ValidationButton } from '../../../../components';
import D from '../../../../deprecated-locales/build-dictionary';
import { Sims } from '../../../../model/Sims';
import { useGoBack } from '../../../../utils/hooks/useGoBack';

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
				<Button
					action={`/operations/sims/${sims.id}/modify`}
					label={
						<>
							<span
								className="glyphicon glyphicon-floppy-disk"
								aria-hidden="true"
							/>
							<span> {D.btnUpdate}</span>
						</>
					}
				/>
			</Auth>
			<ExportButton action={onExport} />
		</ActionToolbar>
	);
};
