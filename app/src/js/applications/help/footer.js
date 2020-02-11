import React from 'react';
import { Link } from 'react-router-dom';
import { getLang } from '@inseefr/ui';
import './help.scss';

export default ({ content, selectedId }) => {
	const previous = content.find(c => c.id === selectedId - 1) || {};
	const next = content.find(c => c.id === selectedId + 1) || {};
	const link = (obj, before, after) =>
		Object.keys(obj).length !== 0 && (
			<Link to={`/concepts/help/${obj.id}`}>{`${before}${
				obj.title[getLang()]
			}${after}`}</Link>
		);
	return (
		<div className="row help-footer">
			<div className="col-md-6">{link(previous, '<< ', '')}</div>
			<div className="col-md-6">
				<div className=" pull-right">{link(next, '', ' >>')}</div>
			</div>
		</div>
	);
};
