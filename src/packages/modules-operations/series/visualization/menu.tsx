import Auth from '../../../auth/components/auth';
import { ADMIN, SERIES_CONTRIBUTOR } from '../../../auth/roles';
import { ActionToolbar } from '@components/action-toolbar';
import { Button } from '@components/buttons/button';
import {
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import D from '../../../deprecated-locales/build-dictionary';
import { Series } from '../../../model/operations/series';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { containUnsupportedStyles } from '../../../utils/html-utils';
import { ValidationButton } from '@components/validationButton';

type MenuTypes = {
	series: Series;
	onPublish: () => void;
};
export const Menu = ({ series, onPublish }: Readonly<MenuTypes>) => {
	const goBack = useGoBack();

	/*
	 * The publication button should be enabled only if RICH_TEXT value do not
	 * have unsupported styles like STRIKETHROUGH, color or background color
	 */
	const publicationDisabled = containUnsupportedStyles(series);
	const checkStamp = (stamp: string) => series.creators.includes(stamp);
	const ableToCreateASimsForThisSeries = (series.operations || []).length === 0;

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/operations/series')} />

			{series.idSims && (
				<Button
					action={`/operations/sims/${series.idSims}`}
					label={D.btnSimsVisu}
				/>
			)}
			{!series.idSims && (
				<Auth
					roles={[ADMIN, [SERIES_CONTRIBUTOR, checkStamp]]}
					complementaryCheck={ableToCreateASimsForThisSeries}
				>
					<Button
						action={`/operations/series/${series.id}/sims/create`}
						label={D.btnSimsCreate}
					/>
				</Auth>
			)}
			<Auth roles={[ADMIN, [SERIES_CONTRIBUTOR, checkStamp]]}>
				<ValidationButton
					object={series}
					callback={onPublish}
					disabled={publicationDisabled}
				/>
			</Auth>
			<Auth roles={[ADMIN, [SERIES_CONTRIBUTOR, checkStamp]]}>
				<UpdateButton action={`/operations/series/${series.id}/modify`} />
			</Auth>
		</ActionToolbar>
	);
};
