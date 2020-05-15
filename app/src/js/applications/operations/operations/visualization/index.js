import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as select from 'js/reducers';
import { EXPORT_VARBOOK } from 'js/actions/constants';

import {
	Loading,
	ErrorBloc,
	Button,
	ActionToolbar,
	buildExtract,
	goBack,
	ReturnButton,
} from '@inseefr/wilco';
import OperationsOperationVisualization from './home';
import exportVariableBook from 'js/actions/operations/export-varBook';
import loadOperation, {
	publishOperation,
} from 'js/actions/operations/operations/item';
import D from 'js/i18n';
import Auth from 'js/utils/auth/components/auth';
import { ADMIN, CNIS, SERIES_CONTRIBUTOR } from 'js/utils/auth/roles';
import {
	ValidationButton,
	Stores,
	CheckSecondLang,
	PageTitleBlock,
} from 'bauhaus-utilities';
import VisualizationContainer from 'js/applications/operations/shared/vizualisation-container';

const extractId = buildExtract('id');

class OperationVisualizationContainer extends VisualizationContainer {
	static propTypes = {
		object: PropTypes.object.isRequired,
		id: PropTypes.string.isRequired,
		exportVariableBook: PropTypes.func,
		exportStatus: PropTypes.string,
		langs: PropTypes.object,
		secondLang: PropTypes.bool,
	};

	render() {
		const {
			id,
			object: { ...operation },
			langs,
			secondLang,
		} = this.props;
		const { serverSideError } = this.state;

		if (!operation.id) return <Loading />;

		return (
			<div className="container">
				<PageTitleBlock
					titleLg1={operation.prefLabelLg1}
					titleLg2={operation.prefLabelLg2}
					secondLang={secondLang}
				/>
				<ActionToolbar>
					<ReturnButton action={goBack(this.props, '/operations/operations')} />

					{operation.idSims && (
						<Button
							action={`/operations/sims/${operation.idSims}`}
							label={D.btnSimsVisu}
						/>
					)}
					{!operation.idSims && (
						<Auth roles={[ADMIN, SERIES_CONTRIBUTOR]}>
							<Button
								action={`/operations/operation/${operation.id}/sims/create`}
								label={D.btnSimsCreate}
							/>
						</Auth>
					)}
					<Auth roles={[ADMIN, SERIES_CONTRIBUTOR]}>
						<ValidationButton
							object={operation}
							callback={object =>
								this.publish(object, this.props.publishOperation)
							}
						/>
					</Auth>
					<Auth roles={[ADMIN, CNIS, SERIES_CONTRIBUTOR]}>
						<Button
							action={`/operations/operation/${operation.id}/modify`}
							label={D.btnUpdate}
						/>
					</Auth>
				</ActionToolbar>

				<ErrorBloc error={serverSideError} />

				<CheckSecondLang />

				<OperationsOperationVisualization
					id={id}
					attr={operation}
					langs={langs}
					secondLang={secondLang}
				/>
			</div>
		);
	}
}

export const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const operation = select.getOperation(state);
	return {
		id,
		object: id === operation.id ? operation : {},
		exportStatus: select.getStatus(state, EXPORT_VARBOOK),
		langs: select.getLangs(state),
		secondLang: Stores.SecondLang.getSecondLang(state),
	};
};

const mapDispatchToProps = {
	exportVariableBook,
	load: loadOperation,
	publishOperation,
};

OperationVisualizationContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OperationVisualizationContainer);

export default withRouter(OperationVisualizationContainer);
