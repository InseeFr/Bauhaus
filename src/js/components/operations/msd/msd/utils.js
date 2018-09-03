export function isOpen(id) {
	const collapsed = JSON.parse(localStorage.getItem('HELP_COLLAPSED')) || {};
	return collapsed[id] || false;
}

export function toggleOpen(id) {
	const collapsed = JSON.parse(localStorage.getItem('HELP_COLLAPSED')) || {};
	const previous = collapsed[id] || false;
	localStorage.setItem(
		'HELP_COLLAPSED',
		JSON.stringify({
			...collapsed,
			[id]: !previous,
		})
	);
}
