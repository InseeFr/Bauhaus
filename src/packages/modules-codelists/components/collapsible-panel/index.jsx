import { useState, useCallback } from 'react';

import { Note } from '@components/note';

export const CollapsiblePanel = ({
	id,
	title,
	children,
	hidden: hiddenProps,
	collapsible = true,
}) => {
	const [hidden, setHidden] = useState(hiddenProps);
	const clickTitleHandler = useCallback(() => {
		setHidden(!hidden);
	}, [hidden]);

	const bodyId = `${id}body`;
	const buttonId = `${id}button`;

	return (
		<div className="bauhaus-collapsible-panel">
			<Note
				text={
					<div id={bodyId} aria-labelledby={buttonId} hidden={hidden}>
						{children}
					</div>
				}
				title={
					collapsible ? (
						<button
							type="button"
							id={buttonId}
							aria-expanded={!hidden}
							aria-controls={bodyId}
							onClick={clickTitleHandler}
						>
							{title}
							<span
								className={`glyphicon glyphicon-chevron-${
									hidden ? 'down' : 'up'
								}`}
							/>
						</button>
					) : (
						title
					)
				}
				alone={true}
			/>
		</div>
	);
};
