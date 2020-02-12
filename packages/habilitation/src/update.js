import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
	PageTitle,
	Select,
	Picker,
	ReturnButton,
	SaveButton,
	ActionToolbar,
} from '@inseefr/wilco';
import * as U from './utils';
import D from './build-dictionary';

export class Update extends Component {
	constructor(props) {
		super(props);
		const { agents, roles } = props;

		const options = roles.map(role => ({
			label: role.label,
			value: role.id,
		}));

		this.state = {
			options,
			selectedRole: options[0],
			toAdd: {},
			toDelete: {},
			newAgents: U.buildAgents(agents, roles, options[0].value),
			oldAgents: U.buildAgents(agents, roles, options[0].value),
		};

		this.onSelect = selectedRoleId => {
			const selectedRole = this.state.options.find(
				({ value }) => value === selectedRoleId
			);
			const { agents, roles } = this.props;
			this.setState({
				selectedRole,
				oldAgents: U.buildAgents(agents, roles, selectedRole.value),
				newAgents: U.buildAgents(agents, roles, selectedRole.value),
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
						[selectedRole.value]: [...addArray],
					},
				});
			delArray.length !== 0 &&
				this.setState({
					toDelete: {
						...toDelete,
						[selectedRole.value]: [...delArray],
					},
				});
		};
	}

	render() {
		const { selectedRole, newAgents, toAdd, toDelete, options } = this.state;
		return (
			<div className="container">
				<PageTitle title={D.authorizationTitle} />
				<ActionToolbar>
					<ReturnButton action="./" />
					<SaveButton
						action={this.handleSave}
						disabled={Object.keys({ ...toAdd, ...toDelete }).length === 0}
					/>
				</ActionToolbar>
				<div className="row">
					<div className="col-md-6 col-md-offset-3">
						<div className="form-group">
							<Select
								id="role-picker"
								placeholder={D.pickedRolePlaceholder}
								value={selectedRole}
								options={options}
								onChange={this.onSelect}
								searchable={true}
								unclearable={true}
							/>
						</div>
					</div>
				</div>
				<Picker
					items={newAgents}
					panelTitle={selectedRole.label}
					onChange={this.onChangePicker}
				/>
			</div>
		);
	}
}

export default withRouter(Update);
