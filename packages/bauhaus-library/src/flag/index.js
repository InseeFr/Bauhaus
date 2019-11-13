import React from 'react';

const Flag = ({ flag }) => {
	if (!flag) return null;
	return <img src={flag} alt="flag" className="img-flag" />;
};

export default Flag;
