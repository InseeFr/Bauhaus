import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import Controls from './controls';
import ModalRmes from 'js/components/shared/modal-rmes';
import { Note } from 'js/components/shared/note';
import D from 'js/i18n';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import PageSubtitle from 'js/components/shared/page-subtitle';
import { Link } from 'react-router-dom';
function OperationVisualization(props) {
	const {
		attr,
		exportVarBook,
		isModalOpen,
		openModal,
		closeModal,
		secondLang,
		langs: { lg1, lg2 },
	} = props;
	const modalButtons = [
		{
			label: D.btnCancel,
			action: closeModal,
			style: 'primary',
		},
		{
			label: D.btnValid,
			action: exportVarBook,
			style: 'primary',
		},
	];

	return (
		<div className="container">
			<CheckSecondLang
				secondLang={secondLang}
				onChange={props.saveSecondLang}
			/>
			<Link
				className="btn btn-primary btn-lg pull-right"
				to={`/operations/operation/${attr.id}/modify`}
			>
				{D.btnUpdate}
			</Link>
			<Controls openModal={openModal} />
			<ModalRmes
				id="modal"
				isOpen={isModalOpen}
				title="Choix du type d'export du dictionnaire de variables"
				body="TODO"
				closeCancel={closeModal}
				modalButtons={modalButtons}
			/>

			<PageTitle
				title={attr.prefLabelLg1}
				context="operations"
				col="12"
				offset="0"
			/>
			{secondLang &&
				attr.prefLabelLg2 && <PageSubtitle subTitle={attr.prefLabelLg2} />}

			{attr.altLabel1 && (
				<div className="row">
					<Note
						text={attr.altLabel1}
						title={D.altLabelTitle}
						lang={lg1}
						alone={!secondLang || !attr.altLabel2}
					/>
					{secondLang && (
						<Note
							text={attr.altLabel2}
							title={D.altLabelTitle}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
			{attr.millesime && (
				<div className="row">
					<Note text={attr.millesime} title={D.year} lang={lg1} alone={true} />
				</div>
			)}
		</div>
	);
}

OperationVisualization.propTypes = {
	exportVarBook: PropTypes.func.isRequired,
	attr: PropTypes.object.isRequired,
	saveSecondLang: PropTypes.func.isRequired,
};

export default OperationVisualization;
