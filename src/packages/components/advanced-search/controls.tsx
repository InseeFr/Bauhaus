import { ActionToolbar, ReturnButton, ResetButton } from '@inseefr/wilco';

export const AdvancedSearchControls = ({
	onClickReturn,
	initializeState,
}: {
	onClickReturn: any;
	initializeState: any;
}) => (
	<ActionToolbar>
		<ReturnButton action={onClickReturn} />
		<ResetButton action={initializeState} />
	</ActionToolbar>
);
