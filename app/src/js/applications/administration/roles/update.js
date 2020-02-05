import React, { Component } from 'react';
import { PageTitle, Button } from 'bauhaus-library';
import SelectRmes from 'js/applications/shared/select-rmes';
import Picker from 'js/applications/shared/picker';
import * as U from 'js/utils/administration/utils';
import D from 'js/i18n';

class Update extends Component {
	constructor(props) {
		super(props);
		const { agents, roles } = props;
		this.state = {
			selectedRole: roles[0].id,
			toAdd: {},
			toDelete: {},
			newAgents: U.buildAgents(agents, roles, roles[0].id),
			oldAgents: U.buildAgents(agents, roles, roles[0].id),
		};
		this.onSelect = selectedRole => {
			const { agents, roles } = this.props;
			this.setState({
				selectedRole,
				oldAgents: U.buildAgents(agents, roles, selectedRole),
				newAgents: U.buildAgents(agents, roles, selectedRole),
			});
		};
		this.handleSave = () => {
			const { toAdd, toDelete } = this.state;
			const data = U.buildDataToSave(toAdd, toDelete);
			this.props.handleSave(data);
		};
		this.onChangePicker = agents => {
			const { oldAgents, selectedRole, toAdd, toDelete } = this.state;
			const addArray = U.extractAdded(agents, oldAgents);
			const delArray = U.extractDeleted(agents, oldAgents);
			addArray.length !== 0 &&
				this.setState({
					toAdd: {
						...toAdd,
						[selectedRole]: [...addArray],
					},
				});
			delArray.length !== 0 &&
				this.setState({
					toDelete: {
						...toDelete,
						[selectedRole]: [...delArray],
					},
				});
		};
	}

	render() {
		const { roles } = this.props;
		const { selectedRole, newAgents, toAdd, toDelete } = this.state;
		const selectedRoleLabel = U.getRoleLabel(roles, selectedRole);
		return (
			<div className="container">
				<PageTitle title={D.authorizationManagementTitle} />
				<div className="row btn-line action-toolbar">
					<Button label={D.btnReturn} action="/administration/roles" />
					<Button
						label={D.btnSave}
						action={this.handleSave}
						offset={8}
						disabled={Object.keys({ ...toAdd, ...toDelete }).length === 0}
					/>
				</div>
				<div className="row">
					<div className="col-md-6 col-md-offset-3">
						<div className="form-group">
							<SelectRmes
								className="form-control"
								placeholder={D.pickedRolePlaceholder}
								value={selectedRole}
								options={roles.map(role => ({
									label: role.label,
									value: role.id,
								}))}
								onChange={this.onSelect}
								searchable={true}
								unclearable={true}
							/>
						</div>
					</div>
				</div>
				<Picker
					items={newAgents}
					panelTitle={selectedRoleLabel}
					onChange={this.onChangePicker}
				/>
			</div>
		);
	}
}

export default Update;
