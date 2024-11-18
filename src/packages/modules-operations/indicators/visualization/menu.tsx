import Auth from '../../../auth/components/auth';
import { ADMIN, INDICATOR_CONTRIBUTOR } from '../../../auth/roles';
import { ActionToolbar } from '@components/action-toolbar';
import { Button } from '@components/buttons/button';
import {
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import D from '../../../deprecated-locales/build-dictionary';
import { Indicator } from '../../../model/operations/indicator';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { containUnsupportedStyles } from '../../../utils/html-utils';
import { ValidationButton } from '@components/validationButton';

type MenuTypes = {
	indicator: Indicator;
	publish: () => void;
};

export const Menu = ({ indicator, publish }: Readonly<MenuTypes>) => {
	const goBack = useGoBack();

	/*
	 * The publication button should be enabled only if RICH_TEXT value do not
	 * have unsupported styles like STRIKETHROUGH, color or background color
	 */
	const publicationDisabled = containUnsupportedStyles(indicator);
	const checkStamp = (stamp: string) => indicator.creators.includes(stamp);

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/operations/indicators')} />
			{indicator.idSims && (
				<Button
					action={`/operations/sims/${indicator.idSims}`}
					label={D.btnSimsVisu}
				/>
			)}
			{!indicator.idSims && (
				<Auth roles={[ADMIN, [INDICATOR_CONTRIBUTOR, checkStamp]]}>
					<Button
						action={`/operations/indicator/${indicator.id}/sims/create`}
						label={D.btnSimsCreate}
					/>
				</Auth>
			)}
			<Auth roles={[ADMIN, [INDICATOR_CONTRIBUTOR, checkStamp]]}>
				<ValidationButton
					object={indicator}
					callback={publish}
					disabled={publicationDisabled}
				/>
				<UpdateButton action={`/operations/indicator/${indicator.id}/modify`} />
			</Auth>
		</ActionToolbar>
	);
};
