import { ActionToolbar } from '@components/action-toolbar';
import {
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';

import { useGoBack } from '@utils/hooks/useGoBack';
import { containUnsupportedStyles } from '@utils/html-utils';

import Auth from '../../../auth/components/auth';
import { ADMIN } from '../../../auth/roles';
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

			<Auth roles={[ADMIN]}>
				<ValidationButton
					object={family}
					callback={publish}
					disabled={publicationDisabled}
				/>
			</Auth>
			<Auth roles={[ADMIN]}>
				<UpdateButton action={`/operations/family/${family.id}/modify`} />
			</Auth>
		</ActionToolbar>
	);
};
