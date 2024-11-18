import { useState, useCallback, PropsWithChildren } from 'react';

import { Note } from '@components/note';

type CollapsiblePanelTypes = {
	id: string;
	title: any;
	hidden?: boolean;
	collapsible?: boolean;
};
export const CollapsiblePanel = ({
	id,
	title,
	children,
	hidden: hiddenProps,
	collapsible = true,
}: Readonly<PropsWithChildren<CollapsiblePanelTypes>>) => {
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
