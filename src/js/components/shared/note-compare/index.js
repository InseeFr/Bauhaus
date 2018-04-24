import React, { Component } from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { ExplanatoryNote } from 'js/components/shared/explanatory-note';
import {
	creatSelectList,
	creatSelectListSelectedLast,
} from 'js/utils/array-utils';

class CompareNotes extends Component {
	constructor(props) {
		super(props);
		const { version } = props;
		this.state = { select1: version - 1, select2: version };

		this.changeSelect1 = e => {
			this.setState({
				select1: e.target.value,
			});
		};
		this.changeSelect2 = e => {
			this.setState({
				select2: e.target.value,
			});
		};
	}
	render() {
		const {
			secondLang,
			notes,
			langs: { lg1, lg2 },
			version,
			buildNotes,
			context,
		} = this.props;
		const { select1, select2 } = this.state;
		const notesVersion1 = buildNotes(notes[select1]);
		const notesVersion2 = buildNotes(notes[select2]);
		return (
			<div>
				<div className="row">
					<div className="col-md-6 centered">
						<h3>
							{' '}
							{D.version} :{' '}
							<select
								value={this.state.select1}
								onChange={e => this.changeSelect1(e)}
							>
								{creatSelectList(version)}
							</select>
						</h3>
					</div>
					<div className="col-md-6 centered">
						<h3>
							{' '}
							{D.version} :{' '}
							<select
								value={this.state.select2}
								onChange={e => this.changeSelect2(e)}
							>
								{creatSelectListSelectedLast(version)}
							</select>
						</h3>
					</div>
				</div>
				{notesVersion2.map((n, i) => (
					<div className="row" key={`notes-compare-${i}`}>
						<ExplanatoryNote
							text={
								secondLang ? notesVersion1[i]['lg2'] : notesVersion1[i]['lg1']
							}
							title={notesVersion1[i].title}
							lang={secondLang ? lg2 : lg1}
							alone={false}
							context={context}
						/>
						<ExplanatoryNote
							text={secondLang ? n.lg2 : n.lg1}
							title={n.title}
							lang={secondLang ? lg2 : lg1}
							alone={false}
							context={context}
						/>
					</div>
				))}
			</div>
		);
	}
}

CompareNotes.propTypes = {
	secondLang: PropTypes.bool.isRequired,
	notes: PropTypes.object.isRequired,
	langs: PropTypes.object.isRequired,
	version: PropTypes.number.isRequired,
	buildNotes: PropTypes.func.isRequired,
	context: PropTypes.string,
};

export default CompareNotes;
