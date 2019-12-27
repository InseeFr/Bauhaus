import React from 'react';
import bauhausLogo from 'img/logo.svg';
import D from 'js/i18n';
import './index.scss';

export default function ApplicationTitle() {
	return (
		<header className="application-title">
			<div className="application-title__container">
				<div className="application-title__wrapper">
					<h1>
						<img src={bauhausLogo} alt="application logo" />
						{D.welcome}
					</h1>
				</div>
			</div>
		</header>
	);
}
