import { useGoBack } from '../../../utils/hooks/useGoBack';
import D from '../../../deprecated-locales/build-dictionary';
import Auth from '../../../auth/components/auth';
import { ADMIN, SERIES_CONTRIBUTOR } from '../../../auth/roles';
import { ValidationButton } from '../../../components';
import { Operation } from '../../../model/Operation';
import { ActionToolbar } from '../../../components/action-toolbar';
import { ReturnButton } from '../../../components/buttons/buttons-with-icons';
import { Button } from '../../../components/buttons/button';

type MenuTypes = {
	operation: Operation;
	onPublish: () => void;
};
export const Menu = ({ operation, onPublish }: Readonly<MenuTypes>) => {
	const goBack = useGoBack();
	const checkStamp = (stamp: string) =>
		operation.series.creators.includes(stamp);

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/operations/operations')} />

			{operation.idSims && (
				<Button
					action={`/operations/sims/${operation.idSims}`}
					label={D.btnSimsVisu}
				/>
			)}
			{!operation.idSims && (
				<Auth roles={[ADMIN, [SERIES_CONTRIBUTOR, checkStamp]]}>
					<Button
						action={`/operations/operation/${operation.id}/sims/create`}
						label={D.btnSimsCreate}
					/>
				</Auth>
			)}
			<Auth roles={[ADMIN, [SERIES_CONTRIBUTOR, checkStamp]]}>
				<ValidationButton
					object={operation}
					callback={onPublish}
					disabled={false}
				/>
			</Auth>
			<Auth roles={[ADMIN, [SERIES_CONTRIBUTOR, checkStamp]]}>
				<Button
					action={`/operations/operation/${operation.id}/modify`}
					label={D.btnUpdate}
				/>
			</Auth>
		</ActionToolbar>
	);
};
