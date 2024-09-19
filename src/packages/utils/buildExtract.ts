export const buildExtract = (paramName: string) => {
	return (props) => props.match.params[paramName];
};
