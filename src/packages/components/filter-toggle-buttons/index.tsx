import './filter-toggle-buttons.scss';

type FilterToggleButtonsTypes = {
	options: [string, string][];
	currentValue: string;
	handleSelection: (value: string) => void;
};

const FilterToggleButtons = ({
	options,
	currentValue,
	handleSelection,
}: FilterToggleButtonsTypes) => {
	return (
		<div
			className="bauhaus-filter-toggle-buttons btn-group btn-group-justified"
			role="group"
		>
			{options.map(([value, title]) => {
				return (
					<div className="btn-group" role="group" key={value}>
						<button
							type="button"
							className={`btn btn-default ${
								currentValue === value
									? 'bauhaus-filter-toggle-buttons__btn-active'
									: ''
							}`}
							onClick={() => handleSelection(value)}
						>
							{title}
						</button>
					</div>
				);
			})}
		</div>
	);
};

export default FilterToggleButtons;
