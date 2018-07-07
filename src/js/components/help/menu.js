import React from 'react';
import { Link } from 'react-router-dom';
import { getLang } from 'js/i18n/build-dictionary';
import './help.css';

export default ({ content, selectedId }) => (
	<div className="col-md-3 help-menu">
		{content.map((c, i) => (
			<Link
				to={`/concepts/help/${c.id}`}
				key={c.id}
				className={`help-menu-item ${
					c.id === selectedId ? 'help-menu-item-selected' : ''
				}`}
			>
				<p>{c.title[getLang()]}</p>
			</Link>
		))}
	</div>
);
