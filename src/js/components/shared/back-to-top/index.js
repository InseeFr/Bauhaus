import React from 'react';
import D from 'js/i18n';
import './index.css';

window.onload = function() {
	document.addEventListener(
		'scroll',
		function(e) {
			if (window.pageYOffset > 100) {
				document.querySelector('.sticky-top').style.display = 'block';
			} else {
				document.querySelector('.sticky-top').style.display = 'none';
			}
		},
		false
	);
};

export default function BackToTop() {
	return (
		// eslint-disable-next-line
		<a href="#" className="sticky-top" style={{ display: 'none' }}>
			<span className="glyphicon glyphicon-chevron-up" />
			<span data-i18n="footer.sticky-top.texte" className="sticky-text">
				{D.backToTop}
			</span>
		</a>
	);
}
