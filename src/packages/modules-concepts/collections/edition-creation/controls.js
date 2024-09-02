import {
	CancelButton,
	ErrorBloc,
	ActionToolbar,
	SaveButton,
} from '@inseefr/wilco';
import { validate } from './validation';

function Controls({
	general,
	collectionList,
	initialId,
	initialPrefLabelLg1,
	handleSave,
	redirectCancel,
}) {
	const message = validate(
		general,
		collectionList,
		initialId,
		initialPrefLabelLg1
	);
	console.log(message);

	return (
		<>
			<ActionToolbar>
				<CancelButton action={redirectCancel()} />
				<SaveButton action={handleSave} disabled={message} />
			</ActionToolbar>
			<ErrorBloc error={message?.errorMessage[0]} />
		</>
	);
}

export default Controls;
