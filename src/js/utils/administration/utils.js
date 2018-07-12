import { arrayDifferenceByID } from 'js/utils/array-utils';

export const buildAgents = (agents, roles, selectedRole) => {
	const personsId = roles
		.find(r => r.id === selectedRole)
		.persons.map(p => p.id);
	return agents.map(
		a =>
			personsId.includes(a.id)
				? { ...a, isAdded: true }
				: { ...a, isAdded: false }
	);
};

export const getRoleLabel = (roles, selectedRole) =>
	roles.filter(role => role.id === selectedRole)[0].label;

export const extractAdded = (agents, newAgents) =>
	arrayDifferenceByID(
		agents.filter(a => a.isAdded),
		newAgents.filter(a => a.isAdded)
	);

export const extractDeleted = (agents, newAgents) =>
	extractAdded(newAgents, agents);

export const buildDataToAdd = toAdd =>
	Object.entries(toAdd).reduce((_, o) => {
		o[1].map(p => {
			if (_.filter(s => s.id === p.id).length === 0) {
				_.push({ id: p.id, roles: [o[0]] });
				return _;
			} else {
				const save = _.filter(s => s.id !== p.id);
				const up = _.find(s => s.id === p.id);
				up.roles = [...up.roles, o[0]];
				return [...save, up];
			}
		});
		return _;
	}, []);

export const buildDataToDelete = toDelete =>
	Object.entries(toDelete).reduce((_, o) => {
		o[1].map(p => _.push({ role: o[0], id: p.id }));
		return _;
	}, []);

export const buildDataToSave = (toAdd, toDelete) => {
	return {
		toAdd: buildDataToAdd(toAdd),
		toDelete: buildDataToDelete(toDelete),
	};
};
