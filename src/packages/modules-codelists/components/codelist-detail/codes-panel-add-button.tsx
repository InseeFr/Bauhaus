import { AddButton } from '@components/buttons/add';

import { CodesList } from '@model/CodesList';

import { HasAccess } from '../../../auth/components/auth';

interface CodesPanelAddButtonTypes {
	codelist: CodesList;
	onHandlePanel: VoidFunction;
}
export const CodesPanelAddButton = ({
	codelist,
	onHandlePanel,
}: Readonly<CodesPanelAddButtonTypes>) => {
	if (!codelist.lastCodeUriSegment) {
		return null;
	}
	return (
		<HasAccess
			module="CODESLIST_CODESLIST"
			privilege="CREATE"
			stamps={[codelist?.contributor]}
		>
			<AddButton id="add-code" onClick={onHandlePanel} />
		</HasAccess>
	);
};
