import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';

import { HasAccess } from '../../../auth/components/auth';

interface ViewMenuTypes {
	handleUpdate: VoidFunction;
	handleDelete: VoidFunction;
	handleBack: VoidFunction;
	publish: VoidFunction;
	updatable: boolean;
	deletable: boolean;
	codelist: any;
}

export const ViewMenu = ({
	handleUpdate,
	handleDelete,
	handleBack,
	codelist,
	publish,
	updatable,
	deletable,
}: Readonly<ViewMenuTypes>) => {
	return (
		<ActionToolbar>
			<ReturnButton action={handleBack} />

			<HasAccess
				module="CODESLIST_CODESLIST"
				privilege="PUBLISH"
				stamps={[codelist?.contributor]}
			>
				<ValidationButton callback={publish} object={codelist} />
			</HasAccess>

			{deletable && (
				<HasAccess
					module="CODESLIST_CODESLIST"
					privilege="DELETE"
					stamps={[codelist?.contributor]}
				>
					<DeleteButton action={handleDelete} />
				</HasAccess>
			)}

			{updatable && (
				<HasAccess
					module="CODESLIST_CODESLIST"
					privilege="UPDATE"
					stamps={[codelist?.contributor]}
				>
					<UpdateButton action={handleUpdate} />
				</HasAccess>
			)}
		</ActionToolbar>
	);
};
