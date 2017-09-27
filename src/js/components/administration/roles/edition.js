import React, { Component } from 'react';
import EditionControls from './edition-controls';
import DeleteTable from './delete-table';
import Modal from './modal';
import Panel from 'js/components/shared/panel';
import Pagination from 'js/components/shared/pagination';
import SelectRmes from 'js/components/shared/select-rmes';
import AgentItem from './list-item';
import { dictionary } from 'js/utils/dictionary';
import { filterDeburr } from 'js/utils/array-utils';
import addLogo from 'js/components/shared/logo-add';
import delLogo from 'js/components/shared/logo-del';
import './edition.css';

class Edition extends Component {
	constructor(props) {
		super(props);

		this.trackAgents = agents => {
			return (
				agents &&
				agents.map(({ id, label }) => ({
					id,
					label,
					role: [],
				}))
			);
		};

		this.state = {
			searchLabel: '',
			agents: this.trackAgents(this.props.agents),
			deleteData: {},
			addData: [],
			modal: false,
			selectedRole: this.props.roles[0].id,
		};

		this.onSelect = selectedRole => {
			this.setState({
				selectedRole,
			});
		};

		this.handleChange = searchLabel => {
			this.setState({ searchLabel });
		};

		this.openModal = deleteData => {
			this.setState({
				modal: true,
				deleteData,
			});
		};

		this.closeModal = () => {
			this.setState({
				modal: false,
			});
		};
		this.confirmModal = () => {
			const { deleteData, selectedRole } = this.state;
			const data = { role: selectedRole, id: deleteData.id };
			this.props.deleteAgent(data);
		};

		this.addAgent = id => {
			const agentsToAdd = this.state.agents.map(agent => {
				//mutation, but not harmful here
				if (agent.id === id) agent.role.push(this.state.selectedRole);
				return agent;
			});
			this.updateAgentsToAdd(agentsToAdd);
		};

		this.removeAgent = id => {
			const agentsToAdd = this.state.agents.map(agent => {
				//mutation, but not harmful here
				if (agent.id === id) {
					agent.role = agent.role.filter(r => r !== this.state.selectedRole);
				}
				return agent;
			});
			this.updateAgentsToAdd(agentsToAdd);
		};

		this.updateAgentsToAdd = agentsToAdd => {
			const added = agentsToAdd.filter(({ role }) => role.length > 0);
			const addData = added.map(({ id, role }) => {
				return { id, role };
			});
			this.setState({
				addData,
			});
		};

		this.getAgentsByStatus = () => {
			const { agents } = this.state;
			const check = filterDeburr(this.state.searchLabel);
			return agents.reduce(
				(byStatus, { id, label, role }) => {
					if (role.includes(this.state.selectedRole))
						byStatus.added.push({ id, label });
					else check(label) && byStatus.toAdd.push({ id, label });
					return byStatus;
				},
				{ toAdd: [], added: [] }
			);
		};

		this.excludeAffectedAgents = agents => {
			const persons = this.props.roles
				.find(p => p.id === this.state.selectedRole)
				.persons.map(p => p.id);
			return agents.filter(a => !persons.includes(a.id));
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.agents !== this.props.agents)
			this.setState({
				agents: this.trackCollections(nextProps.agents),
			});
	}

	render() {
		const { searchLabel, setEdition, roles } = this.props;

		const { addData, selectedRole, deleteData, modal } = this.state;
		const { toAdd, added } = this.getAgentsByStatus();

		const selectedRoleLabel = roles.filter(role => role.id === selectedRole)[0]
			.label;

		const toAddEls = this.excludeAffectedAgents(toAdd).map(({ id, label }) =>
			<AgentItem
				key={id}
				id={id}
				label={label}
				logo={addLogo}
				handleClick={this.addAgent}
			/>
		);

		const addedEls = added.map(({ id, label }) =>
			<AgentItem
				key={id}
				id={id}
				label={label}
				logo={delLogo}
				handleClick={this.removeAgent}
			/>
		);

		return (
			<div className="container">
				<EditionControls
					setEdition={setEdition}
					addAgent={this.props.addAgent}
					addData={addData}
				/>
				<div className="row">
					<div className="col-md-6 col-md-offset-3">
						<div className="form-group">
							<SelectRmes
								className="form-control"
								placeholder="Sélectionner un rôle ..."
								value={selectedRole}
								options={roles.map(role => ({
									label: role.label,
									value: role.id,
								}))}
								onChange={this.onSelect}
								searchable={true}
							/>
						</div>
					</div>
				</div>
				{selectedRole &&
					<div>
						<DeleteTable
							roles={roles}
							selectedRole={selectedRole}
							openModal={this.openModal}
						/>
						<div className="row picker-agent">
							<div className="col-md-6">
								<Panel title="Agents à ajouter">
									{addedEls}
								</Panel>
							</div>
							<div className="col-md-6 centered">
								<input
									value={searchLabel}
									onChange={e => this.handleChange(e.target.value)}
									type="text"
									placeholder={dictionary.collections.searchLabel}
									className="form-control"
								/>
								<Pagination itemEls={toAddEls} itemsPerPage="10" />
							</div>
						</div>
					</div>}
				<Modal
					title="Confirmation"
					text={`Voulez-vous supprimer le rôle ' ${selectedRoleLabel} ' à ${deleteData.label} ?`}
					isOpen={modal}
					closeModal={this.closeModal}
					confirmModal={this.confirmModal}
				/>
			</div>
		);
	}
}

export default Edition;
