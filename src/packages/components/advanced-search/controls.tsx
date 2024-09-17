import { ReturnButton, ResetButton } from '@inseefr/wilco';
import { ActionToolbar } from '../action-toolbar';

export const AdvancedSearchControls = ({
	onClickReturn,
	initializeState,
}: Readonly<{
	onClickReturn: any;
	initializeState: any;
}>) => (
	<ActionToolbar>
		<ReturnButton action={onClickReturn} />
		<ResetButton action={initializeState} />
	</ActionToolbar>
);
