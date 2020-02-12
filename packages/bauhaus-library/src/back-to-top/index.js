import React from 'react';
import D from '../build-dictionary';
import './back-to-top.scss';

const className = 'bauhaus-sticky-top';

window.onload = function() {
	document.addEventListener(
		'scroll',
		function(e) {
			if (!document.querySelector('.' + className)) {
				return;
			}
			if (window.pageYOffset > 100) {
				document.querySelector('.' + className).style.display = 'block';
			} else {
				document.querySelector('.' + className).style.display = 'none';
			}
		},
		false
	);
};

export default function BackToTop({ label }) {
	const text = D.backToTop || label;
	return (
		// eslint-disable-next-line
		<a href="#" className={className} style={{ display: 'none' }}>
			<span className="glyphicon glyphicon-chevron-up" />
			<span data-i18n="footer.sticky-top.texte" className="sticky-text">
				{text}
			</span>
		</a>
	);
}
