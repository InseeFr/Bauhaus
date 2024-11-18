import { ActionToolbar } from '@components/action-toolbar';
import { ReturnButton } from '@components/buttons/buttons-with-icons';

function Controls() {
	return (
		<ActionToolbar>
			<div className="col-md-2">
				<ReturnButton action="/concepts/administration" />
			</div>
		</ActionToolbar>
	);
}

export default Controls;
