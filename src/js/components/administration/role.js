import React from 'react';
import PageTitle from '../shared/page-title';
import {
	BootstrapTable,
	TableHeaderColumn,
	DeleteButton,
} from 'react-bootstrap-table';
import Modal from './modal';
import SelectRmes from 'js/components/shared/select-rmes';
import logoDel from 'js/components/shared/logo-del';
import del from 'img/del.png';

function Role({
	roles,
	role,
	agents,
	personToDelete,
	onSelect,
	modal,
	handleDelete,
	closeCancel,
	closeValid,
}) {
	const titre = role ? role : 'Gestion des rôles';
	const persons =
		role &&
		roles.find(p => p.id === role).persons.map(p => ({
			...p,
			del: { img: del, id: p.id, label: p.label },
		}));
	const imageFormatter = cell => {
		return (
			<img
				src={cell.img}
				alt="toto"
				onClick={() => handleDelete(cell)}
				className="img-flag"
			/>
		);
	};

	return (
		<div className="container">
			<PageTitle title={titre} />
			<div className="row">
				<div className="col-md-6 col-md-offset-3">
					<div className="form-group">
						<SelectRmes
							className="form-control"
							placeholder={'Rôles ...'}
							value={role}
							options={roles.map(role => ({
								label: role.label,
								value: role.id,
							}))}
							onChange={onSelect}
							searchable={true}
						/>
					</div>
				</div>
			</div>
			{!role &&
				<div className="row">
					<div
						className="col-md-8 col-md-offset-2 alert alert-danger bold centered"
						role="alert"
					>
						Sélectionner un rôle dans la liste
					</div>
				</div>}
			{role &&
				<div className="row">
					<div className="col-md-8 col-md-offset-2">
						<BootstrapTable
							data={persons}
							striped={true}
							hover={true}
							headerStyle={{ background: '#457DBB', color: 'white' }}
							search
							searchPlaceholder="Rechercher ..."
						>
							<TableHeaderColumn
								width={'50%'}
								dataField="label"
								isKey={true}
								dataAlign="center"
								dataSort={true}
							>
								Nom
							</TableHeaderColumn>
							<TableHeaderColumn
								width={'40%'}
								dataField="stamp"
								isKey={false}
								dataAlign="center"
								dataSort={true}
							>
								Timbre
							</TableHeaderColumn>
							<TableHeaderColumn
								width={'10%'}
								dataField="del"
								dataFormat={imageFormatter}
								isKey={false}
								dataAlign="center"
							/>
						</BootstrapTable>
					</div>
				</div>}
			<Modal
				title="Confirmation"
				text={`Voulez-vous supprimer le rôle ' ${role} ' à ${personToDelete.label} ?`}
				isOpen={modal}
				closeCancel={closeCancel}
				closeValid={closeValid}
			/>
		</div>
	);
}

export default Role;
