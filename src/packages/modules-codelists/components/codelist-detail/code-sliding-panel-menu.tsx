import { ActionToolbar } from '@components/action-toolbar';
import {
	ReturnButton,
	SaveButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';

import { CodesList } from '@model/CodesList';

import { HasAccess } from '../../../auth/components/auth';

interface CodeSlidingPanelMenuTypes {
	codelist: CodesList;
	handleSubmit: VoidFunction;
	handleBack: VoidFunction;
	creation: boolean;
}
export const CodeSlidingPanelMenu = ({
	codelist,
	handleSubmit,
	handleBack,
	creation,
}: Readonly<CodeSlidingPanelMenuTypes>) => {
	return (
		<ActionToolbar>
			<ReturnButton action={handleBack} />
			<>
				{!creation && (
					<>
						<HasAccess
							module="CODESLIST_CODESLIST"
							privilege="UPDATE"
							stamps={[codelist?.contributor]}
						>
							<UpdateButton action={handleSubmit} />
						</HasAccess>
					</>
				)}
				{creation && (
					<>
						<HasAccess
							module="CODESLIST_CODESLIST"
							privilege="CREATE"
							stamps={[codelist?.contributor]}
						>
							<SaveButton action={handleSubmit} />
						</HasAccess>
					</>
				)}
			</>
		</ActionToolbar>
	);
};
