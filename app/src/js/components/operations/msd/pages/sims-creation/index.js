import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import Field from 'js/components/operations/msd/pages/sims-creation/sims-field';
import { Button } from 'bauhaus-library';
import { flattenTree } from 'js/utils/msd';
import ReactLoading from 'react-loading';
import { CheckSecondLang } from 'bauhaus-library';
import SelectRmes from 'js/components/shared/select-rmes';
import { DUPLICATE } from 'js/components/operations/msd';
import {
	hasLabelLg2,
	getParentId,
	getParentIdName,
	removeRubricsWhenDuplicate,
	shouldDisplayTitleForPrimaryItem,
} from 'js/components/operations/msd/utils';
import { mdFromEditorState } from 'js/utils/html';

class SimsCreation extends React.Component {
	static propTypes = {
		metadataStructure: PropTypes.object.isRequired,
		codesLists: PropTypes.object.isRequired,
		sims: PropTypes.object,
		onSubmit: PropTypes.func.isRequired,
		goBack: PropTypes.func,
		mode: PropTypes.string,
	};

	constructor(props) {
		super(props);

		const { metadataStructure, sims = {} } = this.props;
		const flattenStructure = flattenTree(metadataStructure);

		this.state = {
			saving: false,
			idParent:
				this.props.mode !== DUPLICATE
					? this.props.idParent || getParentId(this.props.sims)
					: '',

			sims: {
				...Object.keys(flattenStructure).reduce((acc, key) => {
					return {
						...acc,
						[key]: {
							rangeType: flattenStructure[key].rangeType,
							idAttribute: key,
							value: '',
							labelLg1: '',
							labelLg2: '',
						},
					};
				}, {}),
				...removeRubricsWhenDuplicate(props.mode, sims.rubrics),
			},
		};
	}

	handleChange = e => {
		this.setState(state => ({
			...state,
			sims: {
				...state.sims,
				[e.id]: {
					...state.sims[e.id],
					...e.override,
				},
			},
		}));
	};

	updateIdParent = value => {
		this.setState({
			idParent: value,
		});
	};

	handleSubmit = e => {
		e.preventDefault();
		e.stopPropagation();

		this.setState({ saving: true });

		this.props.onSubmit(
			{
				id: this.props.mode !== DUPLICATE ? this.props.sims.id : '',
				labelLg1: this.props.mode !== DUPLICATE ? this.props.sims.labelLg1 : '',
				labelLg2: this.props.mode !== DUPLICATE ? this.props.sims.labelLg2 : '',
				[getParentIdName(this.props.parentType)]: this.state.idParent,
				rubrics: Object.values(this.state.sims).map(rubric => {
					if (rubric.rangeType === 'RICH_TEXT') {
						return {
							...rubric,
							labelLg1: rubric.labelLg1
								? mdFromEditorState(rubric.labelLg1)
								: rubric.labelLg1,
							labelLg2: rubric.labelLg2
								? mdFromEditorState(rubric.labelLg2)
								: rubric.labelLg2,
						};
					}
					return rubric;
				}),
			},
			id => {
				this.setState({ saving: false });
				this.props.goBack(`/operations/sims/${id}`);
			}
		);
	};

	goBack = () => {
		const { goBack, sims, parentType } = this.props;
		const { idParent } = this.state;
		goBack(
			sims.id
				? `/operations/sims/${sims.id}`
				: `/operations/${parentType}/${idParent}`
		);
	};
	render() {
		const {
			metadataStructure,
			codesLists,
			saveSecondLang,
			secondLang,
			mode,
			langs: { lg1, lg2 },
			organisations,
		} = this.props;
		const { sims, idParent } = this.state;
		const operationsOptions = (this.props.sims.parentsWithoutSims || []).map(
			op => ({
				label: op.labelLg1,
				value: op.id,
			})
		);
		function MSDInformations(msd, handleChange, firstLevel = false) {
			return (
				<React.Fragment key={msd.idMas}>
					{firstLevel && shouldDisplayTitleForPrimaryItem(msd) && (
						<h3 className="col-md-12 sims-title">
							{msd.idMas} - {msd.masLabelBasedOnCurrentLang}
						</h3>
					)}
					<div className="row" id={msd.idMas}>
						{!msd.isPresentational && (
							<Field
								msd={msd}
								currentSection={sims[msd.idMas]}
								handleChange={handleChange}
								codesLists={codesLists}
								secondLang={false}
								lang={lg1}
								alone={!hasLabelLg2(msd) || !secondLang}
								organisations={organisations}
							/>
						)}
						{!msd.isPresentational && hasLabelLg2(msd) && secondLang && (
							<Field
								msd={msd}
								currentSection={sims[msd.idMas]}
								handleChange={handleChange}
								codesLists={codesLists}
								secondLang={true}
								lang={lg2}
								alone={false}
								organisations={organisations}
							/>
						)}
					</div>
					{Object.values(msd.children).map(child =>
						MSDInformations(child, handleChange)
					)}
				</React.Fragment>
			);
		}

		if (this.state.saving)
			return (
				<div className="loading-operations">
					<ReactLoading
						type="spinningBubbles"
						delay={0}
						height="50%"
						width="50%"
					/>
				</div>
			);

		return (
			<form>
				<div className="row btn-line">
					<Button
						action={this.goBack}
						label={
							<React.Fragment>
								<span
									className="glyphicon glyphicon-floppy-remove"
									aria-hidden="true"
								/>
								<span> {D.btnCancel}</span>
							</React.Fragment>
						}
					/>
					<div className="col-md-7" />
					<Button
						action={this.handleSubmit}
						label={
							<React.Fragment>
								<span
									className="glyphicon glyphicon-floppy-disk"
									aria-hidden="true"
								/>
								<span> {D.btnSave}</span>
							</React.Fragment>
						}
						col={3}
					/>
				</div>

				{Object.values(metadataStructure).map((msd, index) => {
					return (
						<div key={msd.idMas}>
							{index === 0 && (
								<React.Fragment>
									<CheckSecondLang
										secondLang={secondLang}
										onChange={saveSecondLang}
									/>
									{mode === 'DUPLICATE' && (
										<div id="operation-picker" className="panel panel-default">
											<SelectRmes
												value={idParent}
												placeholder={D.operationsTitle}
												options={operationsOptions}
												onChange={this.updateIdParent}
												searchable
											/>
										</div>
									)}
								</React.Fragment>
							)}
							{MSDInformations(msd, this.handleChange, true)}
						</div>
					);
				})}
			</form>
		);
	}
}

export default SimsCreation;
