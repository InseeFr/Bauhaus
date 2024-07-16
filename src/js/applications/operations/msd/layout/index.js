import { useState } from 'react';
import Outline from '../../../../applications/operations/msd/outline/';
import D from '../../../../i18n';

import './style.scss';

const STATUS = {
	BOTH: 'BOTH',
	SUMMARY: 'SUMMARY',
	CONTENT: 'CONTENT',
};

const MSDComponent = ({
	storeCollapseState,
	metadataStructure,
	children,
	baseUrl,
	disableSectionAnchor,
}) => {
	const [status, setStatus] = useState(
		localStorage.getItem('HELP_VIEW') || STATUS.BOTH
	);

	const changeStatus = (status) => {
		localStorage.setItem('HELP_VIEW', status);
		setStatus(status);
	};

	const changeStatusToBoth = changeStatus(STATUS.BOTH);
	const changeStatusToContent = changeStatus(STATUS.CONTENT);
	const changeStatusToSummary = changeStatus(STATUS.SUMMARY);

	const styleSummary = {
		width: status === STATUS.BOTH ? '30%' : '100%',
		display: status === STATUS.CONTENT ? 'none' : 'block',
	};
	const styleContent = {
		width: status === STATUS.BOTH ? '70%' : '100%',
		display: status === STATUS.SUMMARY ? 'none' : 'block',
	};

	return (
		<div id="consulter-sommaire" className="container msd__container">
			<section className="msd__outline" style={styleSummary}>
				<div className="msd__outline_title">{D.helpSummary}</div>
				<nav className="msd__outline-container">
					<ul className="msd__outline-content">
						{Object.values(metadataStructure).map((metadata) => (
							<Outline
								key={metadata.idMas}
								storeCollapseState={storeCollapseState}
								metadataStructure={metadata}
								baseUrl={baseUrl}
								disableSectionAnchor={disableSectionAnchor}
							/>
						))}
					</ul>
				</nav>
			</section>

			{status === STATUS.CONTENT && (
				<button
					className="msd__panel-trigger_left"
					onClick={changeStatusToBoth}
				>
					{D.helpSummary}
					<span className="glyphicon glyphicon-chevron-right" />
				</button>
			)}
			{status === STATUS.BOTH && (
				<div className="msd__panel-trigger_middle">
					<div>
						<button onClick={changeStatusToContent} title="open content">
							<span className="glyphicon glyphicon-chevron-left" />
						</button>
					</div>
					<div>
						<button onClick={changeStatusToSummary} title="open summary">
							<span className="glyphicon glyphicon-chevron-right" />
						</button>
					</div>
				</div>
			)}
			{status === STATUS.SUMMARY && (
				<button
					className="msd__panel-trigger_right"
					onClick={changeStatusToBoth}
				>
					<span className="glyphicon glyphicon-chevron-left" />
					{D.helpContent}
				</button>
			)}
			<section
				style={styleContent}
				className={
					status === STATUS.CONTENT ? 'msd__content_alone' : 'msd__content'
				}
			>
				{children}
			</section>
		</div>
	);
};

export default MSDComponent;
