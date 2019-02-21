import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import Field from 'js/components/operations/msd/pages/sims-creation/sims-field';
import Button from 'js/components/shared/button';
import { flattenTree } from 'js/utils/msd';
import ReactLoading from 'react-loading';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import SelectRmes from 'js/components/shared/select-rmes';
import { DUPLICATE } from 'js/components/operations/msd';
import { rangeType } from 'js/utils/msd/';

const { RICH_TEXT, TEXT } = rangeType;

/**
 *
 * @param {{rangeType}} section
 * @return boolean
 */
function hasLabelLg2(section) {
	return section.rangeType === TEXT || section.rangeType === RICH_TEXT;
}

/**
 * @type {string[]} name A name to use.
 */
const blackList = ['I.6.4'];
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

		function removeRubricsWhenDuplicate(rubrics = {}) {
			return Object.keys(rubrics).reduce((acc, rubricKey) => {
				if (props.mode === DUPLICATE && blackList.indexOf(rubricKey) >= 0)
					return acc;
				return {
					...acc,
					[rubricKey]: rubrics[rubricKey],
				};
			}, {});
		}
		const { metadataStructure, sims = {} } = this.props;
		const flattenStructure = flattenTree(metadataStructure);

		this.state = {
			saving: false,
			idOperation:
				this.props.mode !== DUPLICATE
					? this.props.idOperation || this.props.sims.idOperation
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
				...removeRubricsWhenDuplicate(sims.rubrics),
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

	updateIdOperation = value => {
		this.setState({
			idOperation: value,
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
				idOperation: this.state.idOperation,
				rubrics: Object.values(this.state.sims),
			},
			id => {
				this.setState({ saving: false });
				this.props.goBack(`/operations/sims/${id}`);
			}
		);
	};

	goBack = () => {
		const { goBack, idOperation, sims } = this.props;
		goBack(
			sims.id
				? `/operations/sims/${sims.id}`
				: `/operations/operation/${idOperation}`
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
		} = this.props;
		const { sims, idOperation } = this.state;
		const operationsOptions = (this.props.sims.operationsWithoutSims || []).map(
			op => ({
				label: op.labelLg1,
				value: op.id,
			})
		);
		function MSDInformations(msd, handleChange, firstLevel = false) {
			return (
				<React.Fragment key={msd.idMas}>
					<div className="row flex" id={msd.idMas}>
						{firstLevel && shouldDisplayTitleForPrimaryItem(msd) && (
							<h3 className="col-md-12">
								{msd.idMas} - {msd.masLabelLg1}
							</h3>
						)}
						{!msd.isPresentational && (
							<Field
								msd={msd}
								currentSection={sims[msd.idMas]}
								handleChange={handleChange}
								codesLists={codesLists}
								secondLang={false}
								lang={lg1}
								alone={!hasLabelLg2(msd) || !secondLang}
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
						context="operations"
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
						context="operations"
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
												value={idOperation}
												placeholder={D.operationsTitle}
												options={operationsOptions}
												onChange={this.updateIdOperation}
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

function shouldDisplayTitleForPrimaryItem(msd) {
	return (
		msd.isPresentational ||
		(!msd.isPresentational && Object.keys(msd.children).length === 0)
	);
}

export default SimsCreation;
