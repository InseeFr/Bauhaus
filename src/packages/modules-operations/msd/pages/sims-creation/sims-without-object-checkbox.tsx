import { useRef, useState } from 'react';
import D from '../../../../deprecated-locales';
import { ConfirmationDelete } from '@components/confirmation-delete';

export const SimsWithoutObjectCheckbox = ({
	checked,
	displayConfirmation,
	onChange,
}: Readonly<{
	checked: boolean;
	displayConfirmation: boolean;
	onChange: (checked: boolean) => void;
}>) => {
	const [modalDisplay, setModalDisplayMode] = useState<boolean>(false);
	const input = useRef<HTMLInputElement>(null);

	return (
		<div className="without-object form-group col-md-12">
			{modalDisplay && (
				<ConfirmationDelete
					className="operations"
					handleNo={() => setModalDisplayMode(false)}
					handleYes={() => {
						setModalDisplayMode(false);
						onChange(true);
					}}
					message={D.simsConfirmationMessage}
				/>
			)}
			<label>
				{D.simsWithoutObjectLabel}
				<input
					ref={input}
					type="checkbox"
					checked={checked}
					onChange={(e) => {
						if (e.target.checked && displayConfirmation) {
							setModalDisplayMode(true);
						} else {
							onChange(e.target.checked);
						}
					}}
				/>
			</label>
		</div>
	);
};
