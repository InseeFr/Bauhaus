import { ActionToolbar } from '@components/action-toolbar';
import {
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';

import { useGoBack } from '@utils/hooks/useGoBack';

import { HasAccess } from '../../../auth/components/auth';
import { Document } from '../../../model/operations/document';

interface MenuTypes {
	document: Document;
	type: string;
}

const checkContributorRight = (document: Document) => {
	return (stamp: string) => {
		const sims = document?.sims ?? [];
		if (sims?.length === 0) {
			return true;
		}
		const stamps = sims.map(({ creators }) => creators);
		for (let i = 1; i < stamps.length; i++) {
			// we first check if all stamps array have the same size.
			if (stamps[i - 1].length !== stamps[i].length) {
				return false;
			}
			if (
				stamps[i - 1].length > 0 &&
				stamps[i - 1].filter((s) => stamps[i].includes(s)).length === 0
			) {
				return false;
			}
		}
		return stamps[0].includes(stamp);
	};
};

export const Menu = ({ document, type }: Readonly<MenuTypes>) => {
	const goBack = useGoBack();

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/operations/documents')} />

			<HasAccess
				module="OPERATION_DOCUMENT"
				privilege="UPDATE"
				check={checkContributorRight(document)}
			>
				<UpdateButton action={`/operations/${type}/${document.id}/modify`} />
			</HasAccess>
		</ActionToolbar>
	);
};
