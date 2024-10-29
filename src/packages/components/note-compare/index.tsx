import { Component } from 'react';
import D from '../../deprecated-locales';
import { ExplanatoryNote } from '../explanatory-note';
import {
	creatSelectList,
	creatSelectListSelectedLast,
} from '../../utils/array-utils';
import { Row } from '../layout';

type CompareNotesTypes = {
	version: number;
	secondLang: boolean;
	notes: any;
	buildNotes: any;
};
type CompareNotesState = {
	select1: number;
	select2: number;
};

export class CompareNotes extends Component<
	CompareNotesTypes,
	CompareNotesState
> {
	constructor(props: CompareNotesTypes) {
		super(props);
		const { version } = props;
		this.state = { select1: version - 1, select2: version };
	}

	changeSelect1 = (e: any) => {
		this.setState({
			select1: e.target.value,
		});
	};
	changeSelect2 = (e: any) => {
		this.setState({
			select2: e.target.value,
		});
	};
	render() {
		const { secondLang, notes, version, buildNotes } = this.props;
		const { select1, select2 } = this.state;
		const notesVersion1 = buildNotes(notes[select1]);
		const notesVersion2 = buildNotes(notes[select2]);

		return (
			<div>
				<Row>
					<div className="col-md-6 text-center">
						<h3>
							{' '}
							{D.version} :{' '}
							<select
								value={this.state.select1}
								onChange={(e) => this.changeSelect1(e)}
							>
								{creatSelectList(version)}
							</select>
						</h3>
					</div>
					<div className="col-md-6 text-center">
						<h3>
							{' '}
							{D.version} :{' '}
							<select
								value={this.state.select2}
								onChange={(e) => this.changeSelect2(e)}
							>
								{creatSelectListSelectedLast(version)}
							</select>
						</h3>
					</div>
				</Row>
				{notesVersion2.map((n: any, i: number) => (
					<Row key={`notes-compare-${i}`}>
						<ExplanatoryNote
							text={
								secondLang ? notesVersion1[i]['lg2'] : notesVersion1[i]['lg1']
							}
							title={D[notesVersion1[i].title]}
							alone={false}
						/>
						<ExplanatoryNote
							text={secondLang ? n.lg2 : n.lg1}
							title={D[n.title]}
							alone={false}
						/>
					</Row>
				))}
			</div>
		);
	}
}
