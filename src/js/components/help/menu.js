import React from 'react';
import { Link } from 'react-router-dom';
import { getLang } from 'js/i18n/build-dictionary';
import './help.css';

export default ({ content, selectedId }) => (
	<div className="col-md-3 help-menu">
		{content.map(
			(c, i) =>
				c.body ? (
					<Link
						to={`/concepts/help/${c.id}`}
						key={c.id}
						className={`help-menu-item ${
							c.id === selectedId ? 'help-menu-item-selected' : ''
						}`}
					>
						<p>{c.title[getLang()]}</p>
					</Link>
				) : (
					<p className="help-menu-sub">{c.title[getLang()]}</p>
				)
		)}
	</div>
);
