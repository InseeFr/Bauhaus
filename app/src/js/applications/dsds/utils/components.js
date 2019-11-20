import * as C from 'js/constants';
import D from 'js/i18n';

const componentTypes = [
  { type: C.ATTRIBUTE_TYPE, label: D.attributTitle, backgroundColor: 'orange' },
  {
    type: C.DIMENSION_TYPE,
    label: D.dimensionTitle,
    backgroundColor: 'green',
  },
  { type: C.MEASURE_TYPE, label: D.measureTitle, backgroundColor: 'purple' },
];

export const getComponentTypeLabel = componentType => {
  const obj = componentTypes.filter(t => t.type === componentType);
  return obj.length === 1 ? obj[0].label : 'Unknow component';
};

export const getComponentBackgroundColor = componentType => {
  const obj = componentTypes.filter(t => t.type === componentType);
  return obj.length === 1 ? obj[0].backgroundColor : 'black';
};
