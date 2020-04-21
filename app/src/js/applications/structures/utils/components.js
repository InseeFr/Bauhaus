import { StructuresConstants } from 'bauhaus-structures';
import D from 'js/i18n';

const componentTypes = [
	{
		type: StructuresConstants.ATTRIBUTE_TYPE,
		label: D.attributTitle,
		backgroundColor: 'orange',
	},
	{
		type: StructuresConstants.DIMENSION_TYPE,
		label: D.dimensionTitle,
		backgroundColor: 'green',
	},
	{
		type: StructuresConstants.MEASURE_TYPE,
		label: D.measureTitle,
		backgroundColor: 'purple',
	},
];

export const getComponentTypeLabel = componentType => {
	const obj = componentTypes.filter(t => t.type === componentType);
	return obj.length === 1 ? obj[0].label : 'Unknow component';
};

export const getComponentBackgroundColor = componentType => {
	const obj = componentTypes.filter(t => t.type === componentType);
	return obj.length === 1 ? obj[0].backgroundColor : 'black';
};
