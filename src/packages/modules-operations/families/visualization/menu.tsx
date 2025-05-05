import { ActionToolbar } from '@components/action-toolbar';
import {
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';

import { useGoBack } from '@utils/hooks/useGoBack';
import { containUnsupportedStyles } from '@utils/html-utils';

import { HasAccess } from '../../../auth/components/auth';
import { Family } from '../../../model/operations/family';

interface MenuTypes {
	family: Family;
	publish: VoidFunction;
}

export const Menu = ({ family, publish }: Readonly<MenuTypes>) => {
	const goBack = useGoBack();

	/*
	 * The publication button should be enabled only if RICH_TEXT value do not
	 * have unsupported styles like STRIKETHROUGH, color or background color
	 */
	const publicationDisabled = containUnsupportedStyles(family);
	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/operations/families')} />

			<HasAccess module="FAMILY" privilege="PUBLISH">
				<ValidationButton
					object={family}
					callback={publish}
					disabled={publicationDisabled}
				/>
			</HasAccess>
			<HasAccess module="FAMILY" privilege="UPDATE">
				<UpdateButton action={`/operations/family/${family.id}/modify`} />
			</HasAccess>
		</ActionToolbar>
	);
};
