import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import './panel-concepts.css';

class PanelHtml extends Component {
	render() {
		return (
			<div className="panel panel-concepts">
				<div className="panel-heading">
					<h3 className="panel-title">
						{this.props.title}
					</h3>
				</div>
				<div className="panel-body">
					<div
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(this.props.children),
						}}
					/>
				</div>
			</div>
		);
	}
}

export default PanelHtml;
