import React from 'react';
import bauhausLogo from 'img/logo.svg';
import D from 'js/i18n';
import './index.scss';

export default function ApplicationTitle() {
	return (
		<header className="application-title">
			<div>
				<img src={bauhausLogo} alt="application logo" />
				<h1>{D.welcome}</h1>
			</div>
		</header>
	);
}
