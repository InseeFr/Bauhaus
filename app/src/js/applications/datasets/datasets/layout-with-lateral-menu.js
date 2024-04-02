import D from '../../../i18n/build-dictionary';
import React, { useState } from 'react';
import './layout-with-lateral-menu.scss';

const styleContent = {
	width: '70%',
	display: 'block',
};

export const CollapsibleTrigger = ({ opened, onClick }) => {
	return (
		<button type="button" title={opened ? D.hide : D.display} onClick={onClick}>
			<span
				className={` glyphicon glyphicon-chevron-${opened ? 'up' : 'down'}`}
			/>
		</button>
	);
};

export const MenuTabInErrorIndicator = ({ isInError }) => {
	if (isInError) {
		return (
			<span ariaLabel={D.menuTabKo} title={D.menuTabKo}>
				⚠️
			</span>
		);
	}

	return <></>;
};

export const LayoutWithLateralMenu = ({ children, layoutConfiguration }) => {
	const [runtimeLayoutConfiguration, setRuntimeLayoutConfiguration] =
		useState(layoutConfiguration);

	const allChildrenItems = Object.values(runtimeLayoutConfiguration).reduce(
		(acc, configuration) => {
			return {
				...acc,
				...configuration.children,
			};
		},
		{}
	);
	const [currentOpenedPanelKey, setCurrentOpenedPanelKey] = useState(
		Object.keys(allChildrenItems)[0]
	);

	const openMainMenu = (key) => {
		setRuntimeLayoutConfiguration({
			...runtimeLayoutConfiguration,
			[key]: {
				...runtimeLayoutConfiguration[key],
				closed: !runtimeLayoutConfiguration[key].closed,
			},
		});
	};

	return (
		<div className="layout_with_lateral_menu">
			<section className="layout_with_lateral_menu__outline">
				<nav>
					<ul>
						{Object.entries(layoutConfiguration).map(([key, configuration]) => {
							const opened = !runtimeLayoutConfiguration[key].closed;

							return (
								<li key={key}>
									<div className="layout_with_lateral_menu__outline__main_item">
										{configuration.title}
										<CollapsibleTrigger
											opened={opened}
											onClick={() => openMainMenu(key)}
										></CollapsibleTrigger>
									</div>

									{opened && (
										<ul className="secondary__item">
											{Object.entries(configuration.children ?? {}).map(
												([key2, configuration2]) => {
													return (
														<li key={key2}>
															<button
																type="button"
																className={
																	key2 === currentOpenedPanelKey
																		? 'selected'
																		: ''
																}
																onClick={() => setCurrentOpenedPanelKey(key2)}
															>
																{configuration2.title}
																<MenuTabInErrorIndicator
																	isInError={configuration2.isInError}
																/>
															</button>
														</li>
													);
												}
											)}
										</ul>
									)}
								</li>
							);
						})}
					</ul>
				</nav>
			</section>
			<section style={styleContent} className="content">
				<h2 className="wilco-page-title__title ">
					{allChildrenItems[currentOpenedPanelKey].title}
				</h2>
				{children(currentOpenedPanelKey)}
			</section>
		</div>
	);
};
