import React, { Component } from 'react';
import PageTitle from 'js/components/shared/page-title';
import Controls from './controls';
import Members from './members';
import D from 'js/i18n';

class FamilyVisualization extends Component {
	render() {
		const {
			family: { general: { prefLabelLg1 }, members },
			secondLang,
		} = this.props;
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<label className="pull-right">
							<input
								type="checkbox"
								checked={secondLang}
								onChange={this.props.saveSecondLang}
							/>{' '}
							{D.displayLg2}
						</label>
					</div>
				</div>
				<PageTitle title={prefLabelLg1} context="classifications" />
				<Controls />
				<div className="row">
					<div className="col-md-12">
						<Members members={members} />
					</div>
				</div>
			</div>
		);
	}
}

export default FamilyVisualization;
