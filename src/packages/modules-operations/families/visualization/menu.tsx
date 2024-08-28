import { Family } from '../../../model/operations/family';
import { ActionToolbar, Button, ReturnButton } from '@inseefr/wilco';
import Auth from '../../../auth/components/auth';
import { ADMIN } from '../../../auth/roles';
import { ValidationButton } from '../../../components';
import D from '../../../deprecated-locales/build-dictionary';
import { containUnsupportedStyles } from '../../../utils/html-utils';
import { useGoBack } from '../../../utils/hooks/useGoBack';

type MenuTypes = {
	family: Family;
	publish: () => void;
};

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
				<Button
					action={`/operations/family/${family.id}/modify`}
					label={D.btnUpdate}
				/>
			</Auth>
		</ActionToolbar>
	);
};
